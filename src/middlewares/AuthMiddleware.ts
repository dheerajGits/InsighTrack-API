import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import PrismaClient from "../utils/PrismaClient";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization").split("Bearer ")[1]
        : null); // to get the api token
    if (token) {
      const key = process.env.JWT_KEY;
      const organisationId = (await verify(token, key))?.id;
      const organisationDetails = await PrismaClient.organisation.findUnique({
        where: {
          id: organisationId,
        },
      }); // if the id is available then we can more forward
      if (organisationDetails) {
        res.status(403).send({ msg: "Wrong Authentication token" });
        return;
      }
      next();
    } else {
      res.status(403).send({ msg: "Authentication token Missing" });
    }
  } catch {
    res.status(403).send({ msg: "Unauthorised access" });
  }
};
export default authMiddleware;

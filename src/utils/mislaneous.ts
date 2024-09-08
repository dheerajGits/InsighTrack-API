import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

const findCompanyId = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization").split("Bearer ")[1]
        : null); // to get the api tokens

    const key = process.env.JWT_KEY;
    const organisationId = (await verify(token, key))?.id;
    return organisationId;
  } catch {
    return null;
  }
};
export { findCompanyId };

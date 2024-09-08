import dayjs from "dayjs";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

const findCompanyId = async (req: Request, res: Response) => {
  // this is used by the main frontend purposes
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

const findCompanyIdByApiToken = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers; // to get the auth headers
    // check if it is basic authorisation
    if (!authorization.startsWith("Basic ")) {
      return null;
    }
    const decodedCredentials = Buffer.from(
      authorization.split(" ")[1],
      "base64"
    ).toString("utf-8");
    const [apiKey, apiToken] = decodedCredentials.split(":");
    // apiKey is the encrypted companyId, and
    const key = process.env.API_KEYJWT;
    const organisationId = (await verify(apiKey, key))?.id;
    return organisationId;
  } catch (e) {
    return null;
  }
};
export { findCompanyId };

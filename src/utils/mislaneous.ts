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

const findDataFromUserTraits = (data: any) => {
  // to get name
  let userName = "";
  let userData = {};
  Object.keys(data).forEach((key: string) => {
    if (key.toLowerCase() == "name") {
      userName = data[`${key}`];
    }
    if (key.toLowerCase() == "firstname" || key.toLowerCase() == "lastName") {
      userName += data[`${key}`];
    }
  });
  let email = "";
  Object.keys(data).forEach((key: string) => {
    if (key.toLowerCase() == "email" || key.toLowerCase() == "mail") {
      userName = data[`${key}`];
    }
  });
  let phoneNo = "";
  Object.keys(data).forEach((key: string) => {
    if (
      key.toLowerCase() == "phone" ||
      key.toLowerCase() == "phoneNo" ||
      key.toLowerCase() == "phonenumber"
    ) {
      userName = data[`${key}`];
    }
    if (
      key.toLowerCase() == "no" ||
      key.toLowerCase() == "number" ||
      key.toLowerCase() == "num"
    ) {
      if (data[`${key}`].length() >= 10 && data[`${key}`].length() <= 13) {
        phoneNo = data[`${key}`];
      }
    }
  });
  if (userName) {
    userData = { ...userData, name: userName };
  }
  if (email) {
    userData = { ...userData, email: email };
  }
  if (phoneNo) {
    userData = { ...userData, phoneNo: phoneNo };
  }
  return userData;
};
export { findCompanyId, findCompanyIdByApiToken, findDataFromUserTraits };

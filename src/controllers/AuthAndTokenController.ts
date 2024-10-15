import ApiTokenServices from "@/services/AuthandTokenServices";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

class AuthAndTokenController {
  public apiTokenServices = new ApiTokenServices();

  public generateToken = async (req: Request, res: Response) => {
    try {
      const companyId = req.query.companyId as string;
      const tokenPayload = await this.apiTokenServices.generateToken(companyId);
      res.status(202).send({ data: tokenPayload, msg: "success" });
    } catch (e) {
      console.log("Unable to generate a token Id");
      res.status(400).send({ msg: "error" });
    }
  };

  public updateTokenValidity = async (req: Request, res: Response) => {};
  public createCookie = async (req: Request, res: Response) => {
    try {
      const companyId = req.query.companyId as string;
      // check if the company he wants to create a token exists in the db
      // then proceed
      const cookiePayload = {
        companyId: companyId,
      };
      const encryptedCookiePayload = sign(cookiePayload, process.env.JWT_KEY);
      res.cookie("Authorization", encryptedCookiePayload, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      }); // set the maxAge to 30 days
      res.status(202).send({ msg: "Authentication complete" });
    } catch (e) {
      res.status(400).send({ message: "couldn't complete authentication" });
    }
  };

  public logOut = async (req: Request, res: Response): Promise<void> => {
    try {
      const authorizationToken = req.cookies["Authorization"];
      const companyId = (await verify(authorizationToken, process.env.JWT_KEY))
        .id;
      // verify the token if it correspondes to a given organisation
      res.cookie("Authorization", "", { httpOnly: true, maxAge: 0 });
      res.status(200).json({ data: "", message: "logout" });
    } catch (error) {}
  };
}

export default AuthAndTokenController;

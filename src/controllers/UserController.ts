import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { findCompanyId, findCompanyIdByApiToken } from "@/utils/mislaneous";
import PrismaClient from "../utils/PrismaClient";
import UserServices from "@/services/UserServices";

class UserController {
  public userServices = new UserServices();

  public getUser = async (req: Request, res: Response) => {
    try {
      let filter = {};
      const pageNo = Number(req.query.page as string) || 1;
      const perPage = Number(req.query.take as string) || 20;
      const startDateTime = req.query.startDate as string;
      const endDateTime = req.query.startDate as string;
      if (startDateTime) {
        filter = {
          ...filter,
          startDateTime: new Date(startDateTime as string),
        };
      }
      if (endDateTime) {
        filter = {
          ...filter,
          endDateTime: new Date(endDateTime as string),
        };
      }
      const companyId = await findCompanyId(req, res);
      if (!companyId) {
        res.status(403).send({ message: "Invalid Token" });
        return;
      }
      const users = await this.userServices.findUserByCompany(
        companyId,
        filter
      );
      res.status(200).send({ message: "Success", users: users });
    } catch (e) {
      res.status(404).send({ message: "Something went wrong" });
    }
  };
  public createUserByCompany = async (req: Request, res: Response) => {
    try {
      const traits = req.body.traits;
      if (!traits) {
        res.status(400).send({ message: "user traits not specified" });
        return;
      }
      const organisationId = await findCompanyIdByApiToken(req, res);
      const user = await this.userServices.createUserByCompany(
        organisationId,
        traits
      );
      res
        .status(200)
        .send({ data: user, message: "user created successfully" });
      console.log("[User created successfully]");
    } catch (e) {
      console.log("[Error in creating user]");
      res.status(400).send({ message: "something went wrong" });
    }
  };
}
export default UserController;

import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { findCompanyId, findCompanyIdByApiToken } from "@/utils/mislaneous";
import PrismaClient from "../utils/PrismaClient";
import UserServices from "@/services/UserServices";
import EventsServices from "@/services/EventsServices";

class UserController {
  public userServices = new UserServices();
  public eventsServices = new EventsServices();

  public getUser = async (req: Request, res: Response) => {
    try {
      console.log(JSON.parse(req.query.filter as string));
      const reqFilter = JSON.parse(req.query.filter as string);
      let filter = [];
      const pageNo = Number(req.query.page as string) || 1;
      const perPage = Number(req.query.take as string) || 20;
      const companyId = await findCompanyId(req, res);
      if (reqFilter) {
        reqFilter.forEach(async (element: any) => {
          if (element?.name) {
            if (element.name == "joinedAt") {
              filter.push({
                createdAt: {
                  gte: element.startDateTime,
                  lte: element.endDateTime,
                },
              });
            }
            if (element.name == "lastSeen") {
              filter.push((element: any) => {
                filter.push({
                  updatedAt: {
                    gte: element.startDateTime,
                    lte: element.endDateTime,
                  },
                });
              });
            }
            if (element.name == "event") {
              const eventIds =
                await this.eventsServices.getEventIdsFromNameList(
                  element.eventList,
                  companyId
                );
              filter.push({
                events: {
                  id: {
                    some: {
                      in: eventIds,
                    },
                  },
                },
              });
            }
          }
        });
      }
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
  public setSuperUserToUser = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const { userId, parentId } = body;
      if (!userId || !parentId) {
        res.status(400).send({ message: "userId or parentId not specified" });
        return;
      }
      const companyId = await findCompanyIdByApiToken(req, res);
      const updatedUserData = await this.userServices.setSuperUserToUser(
        companyId,
        userId,
        parentId
      );
      res.status(200).send({ message: "success", data: updatedUserData });
    } catch {
      res.status(400).send({ message: "something went wrong" });
    }
  };

  public changeUserIdToAlias = async (req: Request, res: Response) => {
    try {
      const { aliasId, userId } = req.body;
      if (!aliasId || !userId) {
        res
          .status(400)
          .send({ message: "Either aliasId or userId not specified" });
        return;
      }
      const data = await this.userServices.changeUserIdOfUser(userId, aliasId);
      if (data.message == "success") {
        res
          .status(200)
          .send({ updatedUser: data.userData, message: "Success" });
        return;
      }
      res.status(400).send({ message: data.message });
    } catch (e) {
      res.status(400).send({ message: "something went wrong" });
    }
  };
}
export default UserController;

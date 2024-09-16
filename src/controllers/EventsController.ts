import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { findCompanyId, findCompanyIdByApiToken } from "@/utils/mislaneous";
import PrismaClient from "../utils/PrismaClient";
import EventsServices from "@/services/EventsServices";

class EventsController {
  public events = PrismaClient.events;
  public organisation = PrismaClient.organisation;
  public shootedEvents = PrismaClient.shootedEvents;
  public eventsServices = new EventsServices();

  public getEvents = async (req: Request, res: Response) => {
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
      const events = await this.eventsServices.findEventsByCompany(
        companyId,
        filter
      );
      res.status(200).send({ message: "Success", events: events });
    } catch (e) {
      res.status(404).send({ message: "Something went wrong" });
    }
  };
  public getShootedEvents = async (req: Request, res: Response) => {
    try {
      let filter = {};
      const pageNo = Number(req.query.page as string) || 1;
      const perPage = Number(req.query.take as string) || 20;
      const startDateTime = req.query.startDate as string;
      const endDateTime = req.query.startDate as string;
      const eventName = req.query.eventName as string;
      if (!eventName) {
        res.status(401).send({ message: "event Name Missing" });
        return;
      }
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
      const eventsShooted = await this.eventsServices.findShootedEvents(
        companyId,
        eventName,
        filter
      );
      res.status(200).send({ message: "Success", events: eventsShooted });
    } catch (e) {
      res.status(404).send({ message: "Something went wrong" });
    }
  };

  public getAnalytics = async (req: Request, res: Response) => {
    try {
      const eventList = req.body.eventList;
      const companyId = await findCompanyId(req, res);
      if (!eventList) {
        res.status(400).send({ message: "event name list not send" });
        return;
      }
      const startDateTime = req.query.startDateTime as string;
      const endDateTime = req.query.endDateTime as string;
      let filter = [];
      if (startDateTime) {
        filter = [
          ...filter,
          {
            startDateTime: new Date(startDateTime),
          },
        ];
      }
      if (endDateTime) {
        filter = [
          ...filter,
          {
            endDateTime: new Date(endDateTime),
          },
        ];
      }
      const analytics = await this.eventsServices.findAnalytics(
        eventList,
        companyId,
        filter
      );
      res.status(200).send({ data: analytics, message: "Success" });
      console.log("[Computed analytics successfully]");
    } catch (e) {
      console.log();
    }
  };
}
export default EventsController;

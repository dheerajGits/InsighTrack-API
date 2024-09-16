import EventsController from "@/controllers/EventsController";
import authMiddleware from "@/middlewares/AuthMiddleware";
import { Router } from "express";

class EventsRoutes {
  public router = Router();
  public route = "/event";
  public eventController = new EventsController();
  constructor() {}
  public initializeRoutes() {
    this.router.get("/", authMiddleware, this.eventController.getEvents);
    this.router.get(
      "/shooted",
      authMiddleware,
      this.eventController.getShootedEvents
    );
    this.router.get(
      "/analytics",
      authMiddleware,
      this.eventController.getAnalytics
    );
  }
}

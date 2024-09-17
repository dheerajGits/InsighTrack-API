import EventsController from "@/controllers/EventsController";
import authMiddleware from "@/middlewares/AuthMiddleware";
import authAndValidityMiddleware from "@/middlewares/AuthAndValidityMiddleware";
import { Router } from "express";

class EventsRoutes {
  public router = Router();
  public route = "/events";
  public eventController = new EventsController();
  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.get(
      `${this.route}/`,
      authMiddleware,
      this.eventController.getEvents
    );
    this.router.get(
      `${this.route}/shooted`,
      authMiddleware,
      this.eventController.getShootedEvents
    );
    this.router.get(
      `${this.route}/analytics`,
      authMiddleware,
      this.eventController.getAnalytics
    );
    this.router.post(
      `${this.router}/api/track`,
      authAndValidityMiddleware,
      this.eventController.shootEvent
    );
  }
}
export default EventsRoutes;

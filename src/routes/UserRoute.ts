import UserController from "../controllers/UserController";
import authMiddleware from "@/middlewares/AuthMiddleware";
import authAndValidityMiddleware from "@/middlewares/AuthAndValidityMiddleware";
import { Router } from "express";

class EventsRoutes {
  public router = Router();
  public route = "/users";
  public userController = new UserController();
  constructor() {}
  public initializeRoutes() {
    this.router.get("/", authMiddleware, this.userController.getUser);
    this.router.post(
      "/create",
      authAndValidityMiddleware,
      this.userController.createUserByCompany
    );
  }
}

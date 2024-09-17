import UserController from "../controllers/UserController";
import authMiddleware from "@/middlewares/AuthMiddleware";
import authAndValidityMiddleware from "@/middlewares/AuthAndValidityMiddleware";
import { Router } from "express";

class UserRoutes {
  public router = Router();
  public route = "/users";
  public userController = new UserController();
  constructor() {
    console.log("Initializing User Routes");
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.get(
      `${this.route}/`,
      authMiddleware,
      this.userController.getUser
    );
    this.router.post(
      `${this.route}/create`,
      authAndValidityMiddleware,
      this.userController.createUserByCompany
    );
  }
}
export default UserRoutes;

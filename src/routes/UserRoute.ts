import UserController from "../controllers/UserController";
import authMiddleware from "@/middlewares/AuthMiddleware";
import authAndValidityMiddleware from "@/middlewares/AuthAndValidityMiddleware";
import { Router } from "express";

class UserRoutes {
  public router = Router();
  public route = "/users";
  public userController = new UserController();
  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.get(
      `${this.route}/`,
      authMiddleware,
      this.userController.getUser
    );
    this.router.post(
      `${this.route}/api/create`,
      authAndValidityMiddleware,
      this.userController.createUserByCompany
    );
    this.router.put(
      `${this.router}/api/alias`,
      authAndValidityMiddleware,
      this.userController.changeUserIdToAlias
    );
    this.router.put(
      `${this.route}/api/set-super-parent`,
      authAndValidityMiddleware,
      this.userController.setSuperUserToUser
    );
  }
}
export default UserRoutes;

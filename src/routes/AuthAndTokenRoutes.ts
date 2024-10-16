import authMiddleware from "@/middlewares/AuthMiddleware";
import authAndValidityMiddleware from "@/middlewares/AuthAndValidityMiddleware";
import { Router } from "express";
import AuthAndTokenController from "@/controllers/AuthAndTokenController";

class AuthAndTokenRoutes {
  public router = Router();
  public path = "/auth";
  public authAndTokenController = new AuthAndTokenController();
  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.post(
      `${this.path}/generate-token`,
      this.authAndTokenController.generateToken
    );
    this.router.put(
      `${this.path}/token/validity`,
      authMiddleware,
      this.authAndTokenController.updateTokenValidity
    );
    this.router.post(
      `${this.path}/log-in`,
      this.authAndTokenController.createCookie
    );
    this.router.post(
      `${this.path}/log-out`,
      authMiddleware,
      this.authAndTokenController.logOut
    );
  }
}
export default AuthAndTokenRoutes;

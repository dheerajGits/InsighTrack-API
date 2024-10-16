import Router from "express";
import OrganisationController from "@/controllers/OrganisationController";
import authMiddleware from "@/middlewares/AuthMiddleware";

class OrganisationRoutes {
  public path = "/organisation";
  public organisationController = new OrganisationController();
  public router = Router();

  public initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.organisationController.getOrganisationInfo
    );
    this.router.post(
      `${this.path}`,
      this.organisationController.createOrganisation
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      this.organisationController.editOrganisation
    );
  }
}

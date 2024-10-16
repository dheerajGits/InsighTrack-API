import { Request, Response } from "express";

class OrganisationController {
  public createOrganisation = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const organisationName = body?.name;
      const registeredEmail = body?.email;
      if (!organisationName) {
        res.status(400).send({ message: "No organisation Name specified" });
        return;
      }
      if (!registeredEmail) {
        res.status(400).send({ message: "No email id connected with company" });
        return;
      }
      const data = {
        name: organisationName,
        email: registeredEmail,
      };

      //   const createSuperUser= awa
    } catch (e) {}
  };
  public editOrganisation = async (req: Request, res: Response) => {
    try {
      const organisationId = req.body?.organisationId;
      if (!organisationId) {
        res.status(400).send({ message: "No organisation id specified" });
        return;
      }
      const body = req.body;
      const addUserIds = JSON.parse(body.addUserIds);
      const removeUserIds = JSON.parse(body.removeUserIds);
      let data: any = {};
      if (addUserIds) {
        data = {
          ...data,
          authorisedUsers: {
            connect: {
              id: addUserIds.map((id) => ({ id })),
            },
          },
        };
        delete body.addUserIds;
      }
      if (removeUserIds) {
        if (data.user) {
          data.user = {
            ...data.user,
            disconnect: {
              id: removeUserIds.map((id) => ({ id })),
            },
          };
        } else {
          data = {
            ...data,
            user: {
              connect: {
                id: removeUserIds.map((id) => ({ id })),
              },
            },
          };
        }
        delete body.removeUserIds;
      }
      data = {
        ...data,
        ...body,
      };
    } catch (e) {}
  };

  public getOrganisationInfo = async (req: Request, res: Response) => {
    try {
      const organisationId = req.query.organisationId as string;
      if (!organisationId) {
        res.status(400).send({ message: "No organisationId specified" });
        return;
      }
    } catch (e) {}
  };
}

export default OrganisationController;

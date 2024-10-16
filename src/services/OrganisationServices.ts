import PrismaClient from "../utils/PrismaClient";
import UserServices from "./UserServices";

class OrganisationServices {
  public organisations = PrismaClient.organisation;
  public userServices = new UserServices();
  public createOrganisation = async (data: any, userName: string) => {
    const createdOrganisation = await this.organisations.create({
      data: {
        ...data,
      },
    });
    const authorisedUser = await this.userServices.createAuthorisedUser(
      userName,
      createdOrganisation.email
    );
    await this.organisations.update({
      where: {
        id: createdOrganisation.id,
      },
      data: {
        authorisedUsers: {
          connect: {
            id: authorisedUser.id,
          },
        },
      },
    }); // this will also connect the user with the organisation
    return createdOrganisation;
  };
  public updateOrganisationData = async (data: any, organisationId: string) => {
    const updatedOrganisation = await this.organisations.update({
      where: {
        id: organisationId,
      },
      data: {
        ...data,
      },
    });
    return updatedOrganisation;
  };
  public findOrganisation = async (organisationId: string) => {
    const organisationDetails = await this.organisations.findUnique({
      where: {
        id: organisationId,
      },
      select: {
        name: true,
        email: true,
        authorisedUsers: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });
    return organisationDetails;
  };
}

export default OrganisationServices;

import PrismaClient from "../utils/PrismaClient";
import { findDataFromUserTraits } from "../utils/mislaneous";

class UserServices {
  public events = PrismaClient.events;
  public eventsShooted = PrismaClient.shootedEvents;
  public users = PrismaClient.user;
  public findUserByCompany = async (organisationId: string, filter: any) => {
    const users = await this.users.findMany({
      where: {
        AND: [
          {
            organisationId: organisationId,
          },
          ...filter, // other filters filter which may be there
        ],
      },
    });
  };
  public createUserByCompany = async (organisationId: string, traits: any) => {
    const userData = findDataFromUserTraits(traits);
    const user = await this.users.create({
      data: {
        ...userData,
        traits: traits,
        organisation: {
          connect: {
            id: organisationId,
          },
        },
      },
    });
  };
}
export default UserServices;

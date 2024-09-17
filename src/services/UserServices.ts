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
  public setSuperUserToUser = async (
    organisationId: string,
    userId: string,
    parentId: string
  ) => {
    const user = await this.users.update({
      where: {
        id: userId,
      },
      data: {
        superUserId: parentId,
      },
    });
    return user;
  };
  public changeUserIdOfUser = async (userId: string, aliasId: string) => {
    const user = await this.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return {
        userData: null,
        message: "User with the specified userId not found",
      };
    }
    const aliasUser = await this.users.findUnique({
      where: {
        id: aliasId,
      },
    });
    if (aliasUser) {
      return {
        userData: null,
        message: "User with the specified aliasId already present",
      };
    }
    const updateUserData = await this.users.update({
      where: {
        id: userId,
      },
      data: {
        id: aliasId,
      },
    });
    return {
      userData: updateUserData,
      message: "Success",
    };
  };
}
export default UserServices;

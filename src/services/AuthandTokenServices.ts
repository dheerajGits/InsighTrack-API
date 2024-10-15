import dayjs from "dayjs";
import PrismaClient from "../utils/PrismaClient";

class ApiTokenServices {
  public user = PrismaClient.user;
  public apiTokens = PrismaClient.tokens;
  public organisations = PrismaClient.organisation;

  // to generate apitoken
  public generateToken = async (organisationId: string) => {
    const generatedToken = await this.apiTokens.create({
      data: {
        organisationId: organisationId,
        expiryDate: dayjs().add(90, "days").toDate(),
      },
    });
    return generatedToken;
  };
  public updateTokenExpiryToken = async (
    tokenId: string,
    organisationId: string,
    updatedExpiryDate: Date
  ) => {
    const updatedTokenDetails = await this.apiTokens.update({
      where: {
        id: tokenId,
      },
      data: {
        expiryDate: dayjs(updatedExpiryDate).toDate(),
      },
    });
    return updatedTokenDetails;
  };
}
export default ApiTokenServices;

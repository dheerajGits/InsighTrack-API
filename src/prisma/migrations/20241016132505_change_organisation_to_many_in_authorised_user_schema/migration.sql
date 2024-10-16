/*
  Warnings:

  - You are about to drop the column `organisationId` on the `AuthorisedUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthorisedUser" DROP CONSTRAINT "AuthorisedUser_organisationId_fkey";

-- AlterTable
ALTER TABLE "AuthorisedUser" DROP COLUMN "organisationId";

-- CreateTable
CREATE TABLE "_AuthorisedUserToOrganisation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorisedUserToOrganisation_AB_unique" ON "_AuthorisedUserToOrganisation"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorisedUserToOrganisation_B_index" ON "_AuthorisedUserToOrganisation"("B");

-- AddForeignKey
ALTER TABLE "_AuthorisedUserToOrganisation" ADD CONSTRAINT "_AuthorisedUserToOrganisation_A_fkey" FOREIGN KEY ("A") REFERENCES "AuthorisedUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorisedUserToOrganisation" ADD CONSTRAINT "_AuthorisedUserToOrganisation_B_fkey" FOREIGN KEY ("B") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

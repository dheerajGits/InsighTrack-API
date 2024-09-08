/*
  Warnings:

  - A unique constraint covering the columns `[name,organisationId]` on the table `Events` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Events_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Events_name_organisationId_key" ON "Events"("name", "organisationId");

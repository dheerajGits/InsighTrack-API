/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organisation_email_key" ON "Organisation"("email");

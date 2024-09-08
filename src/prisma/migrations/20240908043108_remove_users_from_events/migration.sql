/*
  Warnings:

  - You are about to drop the column `userId` on the `Events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_userId_fkey";

-- AlterTable
ALTER TABLE "Events" DROP COLUMN "userId";

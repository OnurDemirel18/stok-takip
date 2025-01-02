/*
  Warnings:

  - You are about to drop the column `emailReports` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reportSchedule` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailReports",
DROP COLUMN "reportSchedule";

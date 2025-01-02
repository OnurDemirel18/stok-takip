-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailReports" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reportSchedule" TEXT;

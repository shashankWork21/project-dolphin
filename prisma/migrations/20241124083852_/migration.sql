/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "dayOfWeek",
ADD COLUMN     "daysOfWeek" INTEGER[];

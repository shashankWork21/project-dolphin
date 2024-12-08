/*
  Warnings:

  - You are about to drop the column `slotTimingId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SlotTiming` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SlotTiming" DROP CONSTRAINT "SlotTiming_coachId_fkey";

-- DropIndex
DROP INDEX "User_slotTimingId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "slotTimingId",
ADD COLUMN     "scheduleId" TEXT;

-- DropTable
DROP TABLE "SlotTiming";

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER[],
    "slotLength" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coachId" TEXT NOT NULL,
    "holidays" TIMESTAMP(3)[],

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_coachId_key" ON "Schedule"("coachId");

-- CreateIndex
CREATE UNIQUE INDEX "User_scheduleId_key" ON "User"("scheduleId");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[coachId]` on the table `SlotTiming` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slotTimingId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "slotTimingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SlotTiming_coachId_key" ON "SlotTiming"("coachId");

-- CreateIndex
CREATE UNIQUE INDEX "User_slotTimingId_key" ON "User"("slotTimingId");

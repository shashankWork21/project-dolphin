/*
  Warnings:

  - Added the required column `slotLength` to the `SlotTiming` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlotTiming" ADD COLUMN     "slotLength" INTEGER NOT NULL;

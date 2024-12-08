/*
  Warnings:

  - You are about to drop the column `areaId` on the `Slot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_areaId_fkey";

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "areaId";

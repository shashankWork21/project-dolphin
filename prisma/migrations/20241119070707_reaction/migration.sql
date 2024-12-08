/*
  Warnings:

  - Added the required column `reaction` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "reaction" "ReactionType" NOT NULL;

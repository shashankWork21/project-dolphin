/*
  Warnings:

  - You are about to drop the column `coachId` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Prompt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_coachId_fkey";

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "coachId",
DROP COLUMN "prompt";

-- AlterTable
ALTER TABLE "RecurringTask" ADD COLUMN     "promptId" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "promptId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

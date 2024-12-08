-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_promptId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_slotId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

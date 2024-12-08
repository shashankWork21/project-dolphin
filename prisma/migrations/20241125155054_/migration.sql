-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "holidays" SET DATA TYPE DATE[];

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "slotId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

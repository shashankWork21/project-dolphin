-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_sessionId_fkey";

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "sessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

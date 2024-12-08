-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

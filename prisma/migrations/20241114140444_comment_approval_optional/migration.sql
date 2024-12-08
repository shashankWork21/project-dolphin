-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "approved" BOOLEAN,
ALTER COLUMN "approvedById" DROP NOT NULL;

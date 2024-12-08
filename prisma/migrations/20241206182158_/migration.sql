/*
  Warnings:

  - The values [IN_PROGEESS] on the enum `TaskStatusTag` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatusTag_new" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');
ALTER TABLE "TaskStatus" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TaskStatus" ALTER COLUMN "status" TYPE "TaskStatusTag_new" USING ("status"::text::"TaskStatusTag_new");
ALTER TYPE "TaskStatusTag" RENAME TO "TaskStatusTag_old";
ALTER TYPE "TaskStatusTag_new" RENAME TO "TaskStatusTag";
DROP TYPE "TaskStatusTag_old";
ALTER TABLE "TaskStatus" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';
COMMIT;

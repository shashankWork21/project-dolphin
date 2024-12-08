/*
  Warnings:

  - You are about to drop the column `areaId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_areaId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "areaId";

-- CreateTable
CREATE TABLE "_AreaToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AreaToPost_AB_unique" ON "_AreaToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaToPost_B_index" ON "_AreaToPost"("B");

-- AddForeignKey
ALTER TABLE "_AreaToPost" ADD CONSTRAINT "_AreaToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToPost" ADD CONSTRAINT "_AreaToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

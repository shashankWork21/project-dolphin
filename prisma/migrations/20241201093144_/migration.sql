-- AlterTable
ALTER TABLE "_AreaToPost" ADD CONSTRAINT "_AreaToPost_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AreaToPost_AB_unique";

-- AlterTable
ALTER TABLE "_AreaToUser" ADD CONSTRAINT "_AreaToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AreaToUser_AB_unique";

-- AlterTable
ALTER TABLE "_Coach to student mapping" ADD CONSTRAINT "_Coach to student mapping_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_Coach to student mapping_AB_unique";

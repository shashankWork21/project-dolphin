-- CreateTable
CREATE TABLE "SlotTiming" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER[],
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coachId" TEXT NOT NULL,

    CONSTRAINT "SlotTiming_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SlotTiming" ADD CONSTRAINT "SlotTiming_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

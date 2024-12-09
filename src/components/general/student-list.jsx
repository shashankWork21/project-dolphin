"use client";

import { Card, CardHeader } from "../ui/card";

import { Badge } from "../ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function StudentList({ slots }) {
  const students = slots.reduce((acc, slot) => {
    if (slot.student) {
      const student = acc.find((s) => s.id === slot.student.id);
      if (!student) {
        return [...acc, slot.student];
      }
    }
    return acc;
  }, []);
  return (
    <div className="w-full mx-auto py-5 px-10 flex flex-col">
      {students.length > 0 && (
        <>
          <h3 className="text-2xl mt-10 font-bold w-full text-center">
            Clients
          </h3>
          <div className="flex space-x-5 flex-wrap w-full mt-10">
            {students.map((coach) => {
              return (
                <Card key={coach.id} className="w-1/3 bg-neutral-200">
                  <CardHeader className="flex flex-row justify-between">
                    <div className="flex gap-3">
                      <h2 className="font-bold text-2xl">
                        {coach.firstName} {coach.lastName}
                      </h2>
                      <Badge className="bg-yellow-200 text-black">Client</Badge>
                    </div>
                    <Link href={`/tasks/${coach.id}`}>
                      <ExternalLink className="cursor-pointer" />
                    </Link>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </>
      )}
      {students.length === 0 && (
        <div className="text-center mt-20 py-10 px-20 bg-neutral-100 text-neutral-400 w-full mx-auto text-2xl font-bold">
          You have no Clients yet
        </div>
      )}
    </div>
  );
}

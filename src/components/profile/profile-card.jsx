import { Pencil } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function ProfileCard({ setEdit, user }) {
  return (
    <Card className="w-9/10 md:w-3/5 2xl:w-1/3 mt-10 mx-auto bg-neutral-100">
      <CardHeader className="w-full font-bold mb-5 mt-2 text-2xl flex flex-row justify-between px-6 py-2 items-center">
        My Profile
        <Pencil
          onClick={() => setEdit(true)}
          size={20}
          className="cursor-pointer bg-white rounded-md p-2 w-fit h-fit hover:bg-neutral-300"
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-row gap-3">
            <h3 className="font-semibold">Name:</h3>
            <p>{`${user?.firstName} ${user?.lastName}`}</p>
          </div>
          <div className="flex flex-row gap-3">
            <h3 className="font-semibold">Email:</h3>
            <p>{user?.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

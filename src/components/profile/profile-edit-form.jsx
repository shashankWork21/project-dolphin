"use client";

import { X } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useActionState } from "react";
import { modifyUserDetails } from "@/actions/auth";
import { Button } from "../ui/button";

export default function ProfileEditForm({ user, setEdit }) {
  const [formState, action] = useActionState(modifyUserDetails, {
    errors: {},
    success: false,
  });

  return (
    <Card className="w-9/10 md:w-3/5 2xl:w-1/3 mt-10 mx-auto bg-neutral-100">
      <CardHeader className="w-full font-bold mb-5 mt-2 text-2xl flex flex-row justify-between px-6 py-2 items-center">
        Edit Profile
        <X
          onClick={() => setEdit(false)}
          size={20}
          className="cursor-pointer bg-white rounded-md p-2 w-fit h-fit hover:bg-neutral-300"
        />
      </CardHeader>
      <CardContent>
        <form className="flex flex-col space-y-3" action={action}>
          <Input
            type="text"
            name="firstName"
            defaultValue={user?.firstName || null}
            placeholder="First Name"
          />
          <Input
            type="text"
            name="lastName"
            defaultValue={user?.lastName || null}
            placeholder="Last Name"
          />
          <Input type="password" name="password" placeholder="New password" />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
          />
          <Button type="submit">Update</Button>
        </form>
        {!!formState.errors._form && (
          <ul className="text-red-600">
            {formState.errors._form?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {!!formState.errors.firstName && (
          <ul className="text-red-600">
            {formState.errors.firstName?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {!!formState.errors.lastName && (
          <ul className="text-red-600">
            {formState.errors.lastName?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {!!formState.errors.confirmPassword && (
          <ul className="text-red-600">
            {formState.errors.confirmPassword?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {formState.success && (
          <div className="p-3 bg-green-100 text-green-700 font-bold w-fit mx-auto text-sm mt-5 rounded-lg">
            Profile updated successfully
          </div>
        )}
      </CardContent>
    </Card>
  );
}

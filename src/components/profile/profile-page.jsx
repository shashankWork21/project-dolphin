"use client";

import { useAuth } from "@/context/auth-context";
import ProfileCard from "./profile-card";
import ProfileEditForm from "./profile-edit-form";
import { useState } from "react";

export default function ProfilePageComponent() {
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  return (
    <div className="w-full">
      {!edit ? (
        <ProfileCard user={user} setEdit={setEdit} />
      ) : (
        <ProfileEditForm user={user} setEdit={setEdit} />
      )}
    </div>
  );
}

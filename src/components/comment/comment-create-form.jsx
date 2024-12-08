"use client";

import { useEffect, useActionState, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/auth-context";
import { createComment } from "@/actions/comments";

export default function CommentCreateForm({ postId, parentId, startOpen }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(startOpen);
  const ref = useRef(null);

  const [formState, action] = useActionState(
    createComment.bind(null, { postId, parentId, userId: user?.id }),
    { errors: {} }
  );

  useEffect(() => {
    if (formState.success) {
      ref.current?.reset();

      if (!startOpen) {
        setOpen(false);
      }
    }
  }, [formState, startOpen]);

  const form = (
    <form action={action} ref={ref} className="mt-5">
      <div className="space-y-4 px-1">
        <Textarea
          name="content"
          label="Reply"
          className="border border-neutral-600"
          placeholder={!!parentId ? "Enter your reply" : "Enter your comment"}
        />
        {formState.errors._form ? (
          <div className="p-2 bg-red-200 text-red-600">
            {formState.errors._form?.join(", ")}
          </div>
        ) : null}
        {formState.errors.content ? (
          <div className="p-2 bg-red-200 text-red-600">
            {formState.errors.content?.join(", ")}
          </div>
        ) : null}
        <Button>{!!parentId ? "Reply" : "Add Comment"}</Button>
      </div>
    </form>
  );

  return (
    <div>
      <Button size="sm" variant="secondary" onClick={() => setOpen(!open)}>
        {!!parentId ? "Reply" : "Add Comment"}
      </Button>

      {open && form}
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";

const createCommentSchema = z.object({
  content: z.string().min(3),
});

export async function createComment(
  { postId, parentId, userId },
  formState,
  formData
) {
  const result = createCommentSchema.safeParse({
    content: formData.get("content"),
  });
  console.log(userId);
  const user = await db.user.findUnique({ where: { id: userId } });
  console.log(user);
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await db.comment.create({
      data: {
        content: result.data.content,
        postId: postId,
        parentId: parentId,
        createdById: userId,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
  }

  revalidatePath("/posts/*");
  return {
    errors: {},
    success: true,
  };
}

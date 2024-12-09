"use server";

import { db } from "@/db";
import { verifyCoach } from "./auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export async function createPost(areaIds, formState, formData) {
  let user;
  try {
    user = await verifyCoach();
  } catch (error) {
    return { errors: { _form: ["Unauthorized"] }, success: false };
  }
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }
  let post;
  try {
    post = await db.post.create({
      data: {
        createdById: user.id,
        content: formData.get("content"),
        title: formData.get("title"),
        areas: {
          connect: areaIds.map((id) => ({ id })),
        },
      },
    });
    console.log(post);
    revalidatePath("/posts");
  } catch (error) {
    console.log(error);
    return {
      errors: { _form: ["Something went wrong, try again"] },
      success: false,
    };
  }
  redirect(`/posts/${post.id}`);
}

// Read a post

export async function getPost(postId) {
  try {
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { createdBy: true, areas: true },
    });
    return post;
  } catch (error) {
    return {};
  }
}

export async function updatePost(postId, formState, formData) {
  try {
    await verifyCoach();
    const post = await db.post.update({
      where: { id: postId },
      data: {
        title: formData.get("title"),
        content: formData.get("content"),
      },
    });
    return post;
  } catch (error) {
    return {
      errors: { _form: ["Something went wrong, try again"] },
    };
  }
}

export async function deletePost(postId) {
  try {
    await verifyCoach();
    await db.post.delete({
      where: { id: postId },
    });
    return true;
  } catch (error) {
    return false;
  }
}

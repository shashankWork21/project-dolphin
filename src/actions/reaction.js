"use server";

import { db } from "@/db";
import { ReactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function upvote({ id, postId, commentId, userId, upvote }) {
  if (postId) {
    await db.reaction.upsert({
      where: {
        id,
      },
      create: {
        postId,
        commentId,
        userId,
        reaction: ReactionType.UPVOTE,
      },
      update: {
        reaction: !upvote ? ReactionType.UPVOTE : null,
      },
    });
  } else if (commentId) {
    await db.reaction.upsert({
      where: {
        id,
      },
      create: {
        postId,
        commentId,
        userId,
        reaction: ReactionType.UPVOTE,
      },
      update: {
        reaction: !upvote ? ReactionType.UPVOTE : null,
      },
    });
  }
  revalidatePath("/posts");
  revalidatePath("/posts/*");
}

export async function downvote({ id, postId, commentId, userId, downvote }) {
  if (postId) {
    await db.reaction.upsert({
      where: {
        id,
      },
      create: {
        postId,
        commentId: null,
        userId,
        reaction: ReactionType.DOWNVOTE,
      },
      update: {
        reaction: !downvote ? ReactionType.DOWNVOTE : null,
      },
    });
  } else if (commentId) {
    await db.reaction.upsert({
      where: {
        id,
      },
      create: {
        postId: null,
        commentId,
        userId,
        reaction: ReactionType.DOWNVOTE,
      },
      update: {
        reaction: !downvote ? ReactionType.DOWNVOTE : null,
      },
    });
  }
  revalidatePath("/posts");
  revalidatePath("/posts/*");
}

export async function deleteReactions() {
  await db.reaction.deleteMany({});
  revalidatePath("/posts");
  revalidatePath("/posts/*");
}

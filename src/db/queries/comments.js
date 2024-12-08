import { db } from "@/db";
import { cache } from "react";

export const fetchCommentsByPostId = cache(async (postId) => {
  return await db.comment.findMany({
    where: { postId },
    include: {
      createdBy: true,
      post: true,
      _count: { select: { children: true } },
    },
  });
});

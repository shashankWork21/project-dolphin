import { cache } from "react";
import { db } from "@/db";

export const getPostById = cache(async (postId) => {
  return await db.post.findUnique({
    where: { id: postId },
    include: {
      createdBy: true,
      comments: {
        include: {
          post: true,
          createdBy: true,
          reactions: true,
          _count: { include: { children: true } },
        },
      },
      reactions: true,
      areas: true,
    },
  });
});

export const getPosts = cache(async () => {
  try {
    const posts = await db.post.findMany({
      orderBy: [
        {
          comments: {
            _count: "desc",
          },
        },
      ],
      include: {
        createdBy: true,
        areas: true,
        reactions: true,
        comments: true,
        _count: { include: { comments: true } },
      },
      take: 5,
    });
    console.log(posts);
    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
});

export const getPostsByUserId = cache(async (userId) => {
  try {
    const posts = await db.post.findMany({
      where: { createdById: userId },
      include: {
        createdBy: true,
        areas: true,
        reactions: true,
        comments: true,
        _count: { include: { comments: true } },
      },
    });
    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
});

export const getPostsByAreas = cache(async (areaIds) => {
  try {
    if (areaIds[0] === "") {
      const posts = await db.post.findMany({
        include: {
          createdBy: true,
          areas: true,
          reactions: true,
          comments: true,
          _count: { include: { comments: true } },
        },
        take: 5,
      });
      return posts;
    }
    const posts = await db.post.findMany({
      where: { areas: { some: { id: { in: areaIds } } } },
      include: {
        createdBy: true,
        areas: true,
        reactions: true,
        comments: true,
        _count: { include: { comments: true } },
      },
    });
    return posts;
  } catch (error) {
    return [];
  }
});

export const getPostsBySearchTerm = cache(async (term) => {
  try {
    if (!term) {
      const posts = await db.post.findMany({
        include: {
          createdBy: true,
          areas: true,
          reactions: true,
          comments: true,
          _count: { select: { comments: true } },
        },
        take: 5,
      });
      return posts;
    }
    const posts = await db.post.findMany({
      where: {
        OR: [{ title: { contains: term } }, { content: { contains: term } }],
      },
      include: {
        createdBy: true,
        areas: true,
        reactions: true,
        comments: true,
        _count: { select: { comments: true } },
      },
    });
    return posts;
  } catch (error) {
    return [];
  }
});

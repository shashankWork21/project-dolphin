"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ExternalLink, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { ReactionType } from "@prisma/client";
import { useAuth } from "@/context/auth-context";

export default function PostShow({ post }) {
  const { user } = useAuth();
  const upvotes =
    post.reactions?.filter(
      (reaction) => reaction.reaction === ReactionType.UPVOTE
    )?.length || 0;
  const downvotes =
    post.reactions?.filter(
      (reaction) => reaction.reaction === ReactionType.DOWNVOTE
    )?.length || 0;

  const userVote = post.reactions?.find(
    (reaction) => reaction.userId === user?.id
  );

  return (
    <Card className="mb-4 border border-neutral-300 bg-neutral-200 mx-auto w-full ">
      <CardHeader className="flex flex-row justify-between">
        <h2 className="text-xl font-bold">{post.title}</h2>
        <Link href={`/posts/${post.id}`}>
          <ExternalLink />
        </Link>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>
        <p className="mb-4 text-md">
          By{" "}
          <span className="font-bold ">
            {post.createdBy.firstName} {post.createdBy.lastName}
          </span>
        </p>
        <div className="flex flex-row items-center justify-around w-fit gap-5">
          <div className="flex flex-row items-center w-fit gap-1">
            <ThumbsUpIcon
              size={24}
              color="#027457"
              strokeWidth={1}
              fill={
                userVote?.reaction === ReactionType.UPVOTE ? "#027457" : "none"
              }
            />
            <p className="text-[#027457] font-bold">{upvotes}</p>
          </div>
          <div className="flex flex-row items-center w-fit gap-1">
            <ThumbsDownIcon
              size={24}
              color="#a00818"
              strokeWidth={1}
              fill={
                userVote?.reaction === ReactionType.DOWNVOTE
                  ? "#a00818"
                  : "none"
              }
            />
            <p className="text-[#a00818] font-bold">{downvotes}</p>
          </div>
        </div>
        <p className="mb-4 text-stone-400">{post._count.comments} Comments</p>
      </CardContent>
    </Card>
  );
}

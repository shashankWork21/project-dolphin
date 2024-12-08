"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import CommentCreateForm from "../comment/comment-create-form";
import CommentList from "../comment/comment-list";
import { useAuth } from "@/context/auth-context";
import { deleteReactions, downvote, upvote } from "@/actions/reaction";
import { ReactionType } from "@prisma/client";
import { Button } from "../ui/button";

export default function PostWithComments({ post }) {
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

  const upvoteAction = upvote.bind(null, {
    id: userVote?.id || "",
    postId: post.id,
    userId: user?.id,
    upvote: userVote?.reaction === ReactionType.UPVOTE,
  });
  const downvoteAction = downvote.bind(null, {
    id: userVote?.id || "",
    postId: post.id,
    userId: user?.id,
    downvote: userVote?.reaction === ReactionType.DOWNVOTE,
  });

  return (
    <div className="container mx-auto flex flex-col space-y-5">
      <h1 className="text-2xl font-bold mt-5">{post.title}</h1>
      <form action={deleteReactions} className="hidden">
        <Button type="submit" variant="ghost" className="mt-5">
          Delete Reactions
        </Button>
      </form>
      <p className="my-5">{post.content}</p>
      <div className="flex flex-row gap-8">
        <form action={upvoteAction}>
          <div className="flex flex-row gap-1">
            <button type="submit">
              <ThumbsUpIcon
                size={28}
                color="#027457"
                strokeWidth={1}
                fill={
                  userVote?.reaction === ReactionType.UPVOTE
                    ? "#027457"
                    : "none"
                }
              />
            </button>
            <p className="text-[#027457] font-bold">{upvotes}</p>
          </div>
        </form>
        <form action={downvoteAction}>
          <div className="flex flex-row gap-1">
            <button type="submit">
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
            </button>
            <p className="text-[#a00818] font-bold">{downvotes}</p>
          </div>
        </form>
      </div>
      <CommentCreateForm postId={post.id} startOpen />
      <CommentList comments={post.comments} />
    </div>
  );
}

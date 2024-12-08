"use client";

import { useState } from "react";
import CommentCreateForm from "./comment-create-form";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { downvote, upvote } from "@/actions/reaction";
import { useAuth } from "@/context/auth-context";
import { ReactionType } from "@prisma/client";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export default function CommentItem({ comment, renderedChildren }) {
  const { user } = useAuth();
  const [viewChildren, setViewChildren] = useState(false);

  const upvotes =
    comment.reactions?.filter(
      (reaction) => reaction.reaction === ReactionType.UPVOTE
    )?.length || 0;
  const downvotes =
    comment.reactions?.filter(
      (reaction) => reaction.reaction === ReactionType.DOWNVOTE
    )?.length || 0;

  const userVote = comment.reactions?.find(
    (reaction) => reaction.userId === user?.id
  );

  const upvoteAction = upvote.bind(null, {
    id: userVote?.id || "",
    commentId: comment.id,
    userId: user?.id,
    upvote: userVote?.reaction === ReactionType.UPVOTE,
  });
  const downvoteAction = downvote.bind(null, {
    id: userVote?.id || "",
    commentId: comment.id,
    userId: user?.id,
    downvote: userVote?.reaction === ReactionType.DOWNVOTE,
  });

  return (
    <div className="p-4 border mt-2 mb-1 bg-neutral-200 border-neutral-400 rounded-xl shadow-lg">
      <div className="flex gap-3">
        <div className="flex-1 space-y-3">
          <div className="flex flex-row items-center gap-3">
            <p className="text-md font-medium text-neutral-900">
              {comment.createdBy.firstName} {comment.createdBy.lastName}
            </p>
            {comment.createdById === comment.post.createdById && (
              <Badge className="bg-lime-300 text-black font-medium">
                Author
              </Badge>
            )}
          </div>
          <p className="text-neutral-900">{comment.content}</p>
          <div className="flex flex-row gap-8">
            <form action={upvoteAction}>
              <div className="flex flex-row gap-1">
                <button type="submit">
                  <ThumbsUpIcon
                    size={24}
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
          <div className="flex flex-row items-center justify-start gap-12">
            <p className="text-neutral-600 text-xs">
              {comment._count.children}{" "}
              {comment._count.children === 1 ? "Reply" : "Replies"}
            </p>
            <Button
              variant="ghost"
              onClick={() => setViewChildren(!viewChildren)}
            >
              {viewChildren ? "Hide" : "Show"} Replies
            </Button>
          </div>
          <CommentCreateForm postId={comment.postId} parentId={comment.id} />
        </div>
      </div>
      {viewChildren && <div className="pl-4">{renderedChildren}</div>}
    </div>
  );
}

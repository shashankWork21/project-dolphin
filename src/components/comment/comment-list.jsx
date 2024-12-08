"use client";

import CommentShow from "./comment-show";

export default function CommentList({ comments }) {
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null
  );
  const renderedComments = topLevelComments.map((comment) => {
    return (
      <CommentShow
        key={comment.id}
        comments={comments}
        commentId={comment.id}
        postId={comment.post.id}
      />
    );
  });

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">{topLevelComments.length} comments</h1>
      {renderedComments}
    </div>
  );
}

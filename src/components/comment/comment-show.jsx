"use client";
import CommentItem from "./comment-item";

export default function CommentShow({ comments, commentId, postId }) {
  const comment = comments?.find((c) => c.id === commentId);

  if (!comment) {
    return null;
  }

  const children = comments?.filter((c) => c.parentId === commentId);
  const renderedChildren = children.map((child) => {
    return (
      <CommentShow
        key={child.id}
        comments={comments}
        commentId={child.id}
        postId={postId}
      />
    );
  });

  return <CommentItem comment={comment} renderedChildren={renderedChildren} />;
}

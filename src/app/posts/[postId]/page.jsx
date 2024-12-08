import ProtectedRoute from "@/components/auth/protected-route";
import PostWithComments from "@/components/posts/post-with-comments";
import { getPostById } from "@/db/queries/post";

export default async function PostPage({ params }) {
  const { postId } = await params;
  const post = await getPostById(postId);
  return (
    <ProtectedRoute>
      <PostWithComments post={post} />
    </ProtectedRoute>
  );
}

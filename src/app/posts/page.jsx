import ProtectedRoute from "@/components/auth/protected-route";
import PostsPageContent from "@/components/posts/posts-page";

export default function PostsPage() {
  return (
    <div className="h-full">
      <PostsPageContent />
    </div>
  );
}

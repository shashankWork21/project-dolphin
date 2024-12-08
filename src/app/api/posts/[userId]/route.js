import { getPostsByUserId } from "@/db/queries/post";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const posts = await getPostsByUserId(userId);
    return Response.json(posts);
  } catch (error) {
    console.log(error);
    Response.json([]);
  }
}

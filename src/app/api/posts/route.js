import { getPosts } from "@/db/queries/post";

export async function GET(request) {
  try {
    const posts = await getPosts();
    return Response.json(posts);
  } catch (error) {
    return Response.error(error);
  }
}

import { getPostsByAreas, getPostsBySearchTerm } from "@/db/queries/post";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const areaIds = searchParams.get("areaIds")?.split(",");
    const term = searchParams.get("term");
    if (term !== null) {
      const posts = await getPostsBySearchTerm(term);
      return Response.json(posts);
    } else if (areaIds.length > 0) {
      const posts = await getPostsByAreas(areaIds);
      return Response.json(posts);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    return Response.error(error);
  }
}

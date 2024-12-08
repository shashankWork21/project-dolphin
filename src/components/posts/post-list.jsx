"use client";

import { useEffect, useState } from "react";
import PostShow from "./post-show";
import axios from "axios";

export default function PostList({ url }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchPostsFromServer() {
      const posts = await axios.get(url);
      console.log(posts.data);
      setPosts(posts.data);
    }
    fetchPostsFromServer();
  }, [url]);

  return (
    <div className="h-full w-full">
      <h1 className="text-2xl font-bold mt-10">Posts</h1>
      <div className="mt-10">
        {!!posts.length &&
          posts?.map((post) => (
            <PostShow key={post.id} post={post} showComments={false} />
          ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import PostList from "./post-list";
import { Input } from "../ui/input";

export default function FetchPostsBySearchTerm({}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const handleDebouncedSearchTerm = (searchTerm) => {
    setDebouncedSearchTerm(searchTerm);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="container mx-auto flex flex-col space-y-3 my-5">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Posts"
      />
      <PostList url={`api/posts/search?term=${debouncedSearchTerm}`} />
    </div>
  );
}

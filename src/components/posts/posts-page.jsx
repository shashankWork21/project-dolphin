"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { Role } from "@prisma/client";
import PostList from "./post-list";
import FetchPostsBySearchTerm from "./fetch-posts-by-search-term";
import FetchPostsByArea from "./fetch-posts-by-area";
import PostCreateForm from "./post-create-form";
import { useAuth } from "@/context/auth-context";
import ProtectedRoute from "../auth/protected-route";

export default function PostsPageContent() {
  const { user } = useAuth();
  const role = user?.role;

  const [tabValue, setTabValue] = useState("top_posts");

  return (
    <ProtectedRoute>
      <Tabs
        defaultValue="top_posts"
        onValueChange={(value) => setTabValue(value)}
        className="w-full"
      >
        <TabsList className="mt-5 flex flex-row items-center justify-between container mx-auto py-6 text-black">
          <TabsTrigger
            value="top_posts"
            className={`${
              role === Role.COACH ? "w-1/5" : "w-1/3"
            } text-center py-2 my-2 ${
              tabValue === "top_posts" ? "bg-neutral-800 text-neutral-50" : ""
            }`}
          >
            Top Posts
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className={`${
              role === Role.COACH ? "w-1/5" : "w-1/3"
            } text-center py-2 my-2 ${
              tabValue === "search" ? "bg-neutral-800 text-neutral-50" : ""
            }`}
          >
            Search Posts
          </TabsTrigger>
          <TabsTrigger
            value="area"
            className={`${
              role === Role.COACH ? "w-1/5" : "w-1/3"
            } text-center  py-2 my-2 ${
              tabValue === "area" ? "bg-neutral-800 text-neutral-50" : ""
            }`}
          >
            Posts By area
          </TabsTrigger>
          {role === Role.COACH && (
            <TabsTrigger
              value="coach_posts"
              className={`w-1/5 text-center py-2 my-2 ${
                tabValue === "coach_posts"
                  ? "bg-neutral-800 text-neutral-50"
                  : ""
              }`}
            >
              Your Posts
            </TabsTrigger>
          )}
          {role === Role.COACH && (
            <TabsTrigger
              value="create"
              className={`w-1/5 text-center py-2 my-2 ${
                tabValue === "create" ? "bg-neutral-800 text-neutral-50" : ""
              }`}
            >
              Create Post
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="top_posts">
          <div className="container mx-auto mt-5">
            <PostList url={"/api/posts"} />
          </div>
        </TabsContent>
        <TabsContent value="search">
          <FetchPostsBySearchTerm />
        </TabsContent>
        <TabsContent value="area">
          <FetchPostsByArea />
        </TabsContent>
        {role === Role.COACH && (
          <TabsContent value="coach_posts">
            <div className="container mx-auto mt-5">
              <PostList url={`api/posts/${user.id}`} />
            </div>
          </TabsContent>
        )}
        {role === Role.COACH && (
          <TabsContent value="create">
            <PostCreateForm />
          </TabsContent>
        )}
      </Tabs>
    </ProtectedRoute>
  );
}

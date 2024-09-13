'use client'

import { postsAtom, postsPageAtom } from "@/atoms/postsAtom";
import { userAtom } from "@/atoms/userAtom";
import CreatePostCard from "@/components/layout/CreatePostCard";
import PostsView from "@/components/layout/PostsView";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import { errorAlert } from "@/components/ui/alerts";
import { createHeaders } from "@/utils/createHeaders";
import { isTokenExpired } from "@/utils/isTokenExpired";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Post } from "./types/dataTypes";

export default function Home() {
  const [user, setUser] = useAtom(userAtom)
  const [pageLoading, setPageLoading] = useState(true)
  const [postsPage, setPostsPage] = useAtom(postsPageAtom)
  const [posts, setPosts] = useAtom<Post[]>(postsAtom)

  const fetchPosts = useCallback(async (page: number) => {
    if (!user) return

    try {
      const { token } = user

      if (token && isTokenExpired(token)) {
        errorAlert({
          text: 'Your session expired. Please login again'
        })
        setUser(null)
        return
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/posts?load=${page}`, {
        method: 'GET',
        headers: createHeaders(token)
      })

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) => ([...prevPosts, ...data]));
        setPostsPage((prevPage) => prevPage + 1);
      } else {
        const errorData = await response.json()
        if (errorData.error === 'TokenExpiredError: jwt expired') {
          errorAlert({
            text: 'Your session expired. Please login again'
          })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setPageLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && pageLoading && postsPage === 1) {
      fetchPosts(postsPage)
    }

    if (posts && posts.length > 0) {
      setPageLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user) return (
    <main className="flex flex-grow items-center justify-center pt-12 pb-12">
      <div className="flex flex-col gap-2 w-full lg:w-[60%]">
        {posts?.length > 0 && (
          <>
            <CreatePostCard />
            <PostsView />
          </>
        )}
        {pageLoading && (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        )}
      </div>
    </main>
  )

  if (!pageLoading && !user) {
    return (
      <main className="flex flex-grow items-center justify-center p-24">
        <h1 className="text-3xl">ThreadNest App</h1>
      </main>
    );
  }
}

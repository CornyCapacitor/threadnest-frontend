'use client'

import { postsAtom, postsPageAtom } from "@/atoms/postsAtom";
import { userAtom } from "@/atoms/userAtom";
import CreatePostCard from "@/components/layout/CreatePostCard";
import PostsView from "@/components/layout/PostsView";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import { isTokenExpired } from "@/utils/isTokenExpired";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Post } from "./types/postType";

export default function Home() {
  const [user, setUser] = useAtom(userAtom)
  const [pageLoading, setPageLoading] = useState(true)
  const [postsPage, setPostsPage] = useAtom(postsPageAtom)
  const [posts, setPosts] = useAtom<Post[] | null>(postsAtom)

  const fetchPosts = useCallback(async (page: number) => {
    console.log('Posts fetching')
    if (!user) return

    try {
      const { token } = user

      if (token && isTokenExpired(token)) {
        console.log('Token has expired, you should re-login')
        setUser(null)
        return
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/posts?load=${page}`, {
        method: 'GET',
        headers: headers
      })

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) => (prevPosts ? [...prevPosts, ...data] : data));
        setPostsPage((prevPage) => prevPage + 1);
      } else {
        console.error('Fetch failed with status:', response.status);
        const errorData = await response.json();
        console.error('Error data:', errorData);
        if (errorData.error === 'TokenExpiredError: jwt expired') {
          console.log('You should relogin')
        }
      }
    } catch (error) {
      console.error(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && pageLoading && postsPage === 1) {
      fetchPosts(postsPage)
    }

    setPageLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user && posts) return (
    <main className="flex flex-grow items-center justify-center pt-12 pb-12 gap-2">
      {pageLoading ?
        <div className="flex flex-col gap-2 w-[75%]">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
        :
        <div className="flex flex-col w-[75%] gap-20">
          <CreatePostCard />
          <PostsView />
        </div>
      }
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

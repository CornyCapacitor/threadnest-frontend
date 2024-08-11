'use client'

import { userAtom } from "@/atoms/userAtom";
import { MyTailSpin } from "@/components/ui/tailspin";
import { isTokenExpired } from "@/utils/isTokenExpired";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

type Post = {
  _id: string;
  author_id: string;
  commentsCount: number;
  content: string;
  title: string;
  upvoted: boolean;
  upvotesCount: number;
};

export default function Home() {
  const [user, setUser] = useAtom(userAtom)
  const [pageLoading, setPageLoading] = useState(true)
  const [postsPage, setPostsPage] = useState(1)
  const [posts, setPosts] = useState<Post[] | null>(null)

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
  }, [setUser, user]);

  useEffect(() => {
    if (user && pageLoading) {
      fetchPosts(postsPage).then(() => setPageLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pageLoading, fetchPosts]);

  useEffect(() => {
    if (user !== undefined) {
      setPageLoading(false)
      return
    }
    setPageLoading(true)
  }, [user])

  if (pageLoading) {
    return (
      <main className="flex flex-grow items-center justify-center p-24">
        <h1 className="text-3xl"><MyTailSpin size={50} /></h1>
      </main>
    )
  }

  if (user && posts) return (
    <main className="flex flex-grow items-center justify-center p-24">
      <h1 className="text-3xl">Hello again <span className="text-blue-500">{user.username}</span></h1>
      <div>
        {posts.map((post) => (
          <div className="flex flex-col" key={post._id} id={post._id}>
            <p>Id: {post._id}</p>
            <p>Author id: {post.author_id}</p>
            <p>Comments: {post.commentsCount}</p>
            <p>Title: {post.title}</p>
            <p>Upvoted: {post.upvoted}</p>
            <p>Upvotes: {post.upvotesCount}</p>
          </div>
        ))}
      </div>
    </main>
  )

  return (
    <main className="flex flex-grow items-center justify-center p-24">
      <h1 className="text-3xl">ThreadNest App</h1>
    </main>
  );
}

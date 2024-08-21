'use client'

import { userAtom } from "@/atoms/userAtom"
import { MyTailSpin } from "@/components/ui/tailspin"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { Post } from "@/app/types/dataTypes"
import { AddNewComment } from "@/components/layout/AddNewComment"
import { CommentsSection } from "@/components/layout/CommentsSection"
import PostCard from "@/components/layout/PostCard"
import { isTokenExpired } from "@/utils/isTokenExpired"

const PostPage = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useAtom(userAtom)
  const [pageLoading, setPageLoading] = useState(true)
  const [post, setPost] = useState<Post | null>(null)
  const { id } = params

  const router = useRouter()

  const fetchPost = useCallback(async () => {
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

      const response = await fetch(`https://threadnest-backend.onrender.com/api/posts/${id}`, {
        method: 'GET',
        headers: headers
      })

      if (response.ok) {
        console.log('Data fetched succesfully')
        const data = await response.json()
        console.log(data)
        setPost(data)
      } else {
        console.error('Fetch failed with status:', response.status)
        const errorData = await response.json()
        console.error('Error data:', errorData)
      }
    } catch (error) {
      console.error(error)
    }
  }, [user, setUser, id, setPost])

  useEffect(() => {
    if (user === null) {
      setPageLoading(false)
    } else {
      setPageLoading(false)
      fetchPost()
    }
  }, [user, fetchPost])

  if (pageLoading) {
    return (
      <main className="flex flex-grow flex-col items-center justify-center p-24">
        <MyTailSpin size={50} />
      </main>
    )
  }

  if (!user) {
    return router.push('/')
  }

  if (post) {
    return (
      <main className="flex flex-col flex-grow items-center pt-12 pb-12">
        <div className="flex flex-col gap-2 w-full lg:w-[60%]">
          <PostCard post={post} disabledCommButton={true} />
          <AddNewComment id={id} />
          <CommentsSection id={id} />
        </div>
      </main>
    )
  }
}

export default PostPage

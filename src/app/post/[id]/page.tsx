'use client'

import { userAtom } from "@/atoms/userAtom"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { Post } from "@/app/types/dataTypes"
import { AddNewComment } from "@/components/layout/AddNewComment"
import { CommentsSection } from "@/components/layout/CommentsSection"
import PostCard from "@/components/layout/PostCard"
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton"
import { errorAlert } from "@/components/ui/alerts"
import { createHeaders } from "@/utils/createHeaders"
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
        errorAlert({
          text: 'Your session expired. Please login again'
        })
        setUser(null)
        return
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/posts/${id}`, {
        method: 'GET',
        headers: createHeaders(token)
      })

      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        const errorData = await response.json()
      }
    } catch (error) {
    } finally {
      setPageLoading(false)
    }
  }, [user, setUser, id, setPost])

  const handleIncrementCommentsCount = () => {
    if (post) {
      setPost(
        (prevPost) => {
          if (!prevPost) return null // or return prevPost, not sure which one shall I include
          return { ...prevPost, commentsCount: prevPost.commentsCount + 1 }
        }
      )
    }
  }

  useEffect(() => {
    if (user) {
      fetchPost()
    }
  }, [user, fetchPost])

  if (!pageLoading && !user) {
    return router.push('/')
  }

  if (user) return (
    <main className="flex flex-col flex-grow items-center pt-12 pb-12">
      <div className="flex flex-col gap-2 w-full lg:w-[60%]">
        {post && (
          <>
            <PostCard post={post} disabledCommButton={true} />
            <AddNewComment {...{ id, handleIncrementCommentsCount }} />
            <CommentsSection {...{ id }} />
          </>
        )}
        {pageLoading && (
          <PostCardSkeleton />
        )}
      </div>
    </main>
  )
}

export default PostPage

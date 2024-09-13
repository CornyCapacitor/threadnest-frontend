import { commentsAtom } from "@/atoms/commentsAtom"
import { userAtom } from "@/atoms/userAtom"
import { createHeaders } from "@/utils/createHeaders"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import CommentCardSkeleton from "../skeletons/CommentCardSkeleton"
import { errorAlert } from "../ui/alerts"
import CommentCard from "./CommentCard"

export const CommentsSection = ({ id }: { id: string }) => {
  const [user, setUser] = useAtom(userAtom)
  const [comments, setComments] = useAtom(commentsAtom)
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    if (!user) return

    try {
      const { token } = user

      if (token && isTokenExpired(token)) {
        console.log('Token has expired, you should re-login')
        setUser(null)
        return
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/comments/${id}`, {
        method: 'GET',
        headers: createHeaders(token)
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else if (response.status === 404) {

      } else {
        const errorData = await response.json()
        if (errorData.error === 'TokenExpiredError: jwt expired') {
          errorAlert({
            text: 'Your session expired. Please login again'
          })
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-w-[350px] flex flex-col p-2 rounded-lg w-full gap-2 bg-slate-900 border border-slate-700 shadow-md">
      {!loading && comments && (
        comments.map((comment) => (
          <CommentCard key={comment._id} {...{ comment }} />
        ))
      )}

      {!loading && !comments.length && (
        <p className="self-center">This post has no comments yet</p>
      )}

      {loading && (
        <>
          <CommentCardSkeleton />
          <CommentCardSkeleton />
          <CommentCardSkeleton />
        </>
      )}
    </div>
  )
}
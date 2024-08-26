import { commentsAtom } from "@/atoms/commentsAtom"
import { userAtom } from "@/atoms/userAtom"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import CommentCardSkeleton from "../skeletons/CommentCardSkeleton"
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

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/comments/${id}`, {
        method: 'GET',
        headers: headers
      })

      if (response.ok) {
        console.log('Comments fetched succesfully')
        const data = await response.json()
        console.log(data)
        setComments(data)
      } else if (response.status === 404) {

      } else {
        console.error('Fetch failed with status:', response.status)
        const errorData = await response.json()
        console.error('Error data:', errorData)
        if (errorData.error === 'TokenExpiredError: jwt expired') {
          console.log('You should relogin')
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
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
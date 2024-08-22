import { useEffect, useState } from "react"

import { commentsAtom } from "@/atoms/commentsAtom"
import { userAtom } from "@/atoms/userAtom"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"

export const CommentsSection = ({ id }: { id: string }) => {
  const [user, setUser] = useAtom(userAtom)
  const [comments, setComments] = useAtom(commentsAtom)
  const [loading, setLoading] = useState(false)

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
        setLoading(false)
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
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md">
      {comments && (
        comments.map((comment) => (
          <div key={comment._id}>{comment.content}</div>
        ))
      )}
    </div>
  )
}
import { commentsAtom } from "@/atoms/commentsAtom"
import { userAtom } from "@/atoms/userAtom"
import { createHeaders } from "@/utils/createHeaders"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"
import { useState } from "react"
import { errorAlert } from "../ui/alerts"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { MyTailSpin } from "../ui/tailspin"

export const AddNewComment = ({ id, handleIncrementCommentsCount }: { id: string, handleIncrementCommentsCount: () => void }) => {
  const [user, setUser] = useAtom(userAtom)
  const [loading, setLoading] = useState(false)
  const [, setComments] = useAtom(commentsAtom)
  const [content, setContent] = useState('')

  const addNewComment = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { token } = user

      if (token && isTokenExpired(token)) {
        errorAlert({
          text: 'Your session expired. Please login again'
        })
        setUser(null)
        return
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/comments/${id}`, {
        method: 'POST',
        headers: createHeaders(token),
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        const data = await response.json()
        handleIncrementCommentsCount()
        setComments((prevComments) => [data, ...prevComments])
        setContent('')
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

  return (
    <div className={`min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <h1 className="font-semibold text-xl">Add a new comment</h1>
      {loading ?
        <div className="flex justify-center">
          <MyTailSpin size={100} />
        </div>
        :
        <>
          <Input type="text" placeholder="ex. What a great post!" value={content} onChange={(e) => setContent(e.target.value)} />
          <Button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md w-min" onClick={addNewComment}>Add new comment</Button>
        </>
      }
    </div>
  )
}
import { userAtom } from "@/atoms/userAtom"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const AddNewComment = ({ id }: { id: string }) => {
  const [user, setUser] = useAtom(userAtom)
  const [content, setContent] = useState('')

  const addNewComment = async () => {
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

      const response = await fetch(`https://threadnest-backend.onrender.com/api/comments${id}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        console.log('Comments fetched succesfully')
        const data = await response.json()
        console.log(data)
        setContent('')
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

  return (
    <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md">
      <h1 className="font-semibold text-xl">Add a new comment</h1>
      <Input type="text" placeholder="ex. What a great post!" value={content} onChange={(e) => setContent(e.target.value)} />
      <Button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md w-min" onClick={addNewComment}>Add new comment</Button>
    </div>
  )
}
'use client'

import { userAtom } from "@/atoms/userAtom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MyTailSpin } from "@/components/ui/tailspin"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"
import Image from "next/image"
import { useEffect, useState } from "react"

const EditPage = ({ params }: { params: { id: string } }) => {
  const { id } = params

  const [user, setUser] = useAtom(userAtom)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const fetchPost = async (id: string) => {
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
        console.log('Post fetched succesfully')
        const data = await response.json()
        console.log(data)
        setTitle(data.title)
        setContent(data.content)
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
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (user && pageLoading) {
      fetchPost(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (pageLoading) return (
    <main className="flex flex-grow items-center justify-center p-24">
      <MyTailSpin size={50} />
    </main>
  )

  return (
    <main className="flex flex-grow items-center justify-center pt-12 pb-12">
      <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md max-w-[90%] slide-in">
        <h1 className="text-2xl font-semibold self-center">
          Here you can edit your post!
        </h1>

        <div className="flex flex-col gap-4 pb-4 border-b border-slate-700">
          <label htmlFor="title" className="flex gap-2 text-slate-200 font-semibold">
            Title
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image src="danger.svg" alt="Tooltip icon" width={18} height={18} className="cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Title must contain 3-250 characters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Input
            id="title"
            className="w-full p-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-4 pb-4">
          <label htmlFor="content" className="flex gap-2 text-slate-200 font-semibold">
            Content
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Image src="danger.svg" alt="Tooltip icon" width={18} height={18} className="cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Content must contain 50-2500 characters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Textarea
            id="content"
            className="w-full p-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Update post'}
          </Button>
          <Button
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Delete post'}
          </Button>
          <Button
            className="flex items-center justify-center font-semibold py-2 px-4 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Return'}
          </Button>
        </div>
      </div>
    </main>
  )
}

export default EditPage
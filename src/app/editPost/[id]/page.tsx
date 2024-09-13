'use client'

import { postsAtom, postsPageAtom } from "@/atoms/postsAtom"
import { userAtom } from "@/atoms/userAtom"
import { errorAlert, questionAlert, successAlert } from "@/components/ui/alerts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MyTailSpin } from "@/components/ui/tailspin"
import { Textarea } from "@/components/ui/textarea"
import { errorToast } from "@/components/ui/toasts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createHeaders } from "@/utils/createHeaders"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const EditPage = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const router = useRouter()

  const [posts, setPosts] = useAtom(postsAtom)
  const [postsPage, setPostsPage] = useAtom(postsPageAtom)

  const [user, setUser] = useAtom(userAtom)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const fetchPost = async () => {
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
        setTitle(data.title)
        setContent(data.content)
      } else {
        const errorData = await response.json()
        if (errorData.error === 'TokenExpiredError: jwt expired') {
          errorAlert({
            text: 'Your session expired. Please login again'
          })
        }
      }
      setPageLoading(false)
    } catch (error) {
      return
    }
  }

  const deletePost = async () => {
    if (!user) return
    setLoading(true)

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
        method: 'DELETE',
        headers: createHeaders(token)
      })

      if (response.ok) {
        successAlert({
          text: 'Post deleted succesfully',
          successFunction: () => {
            handleReturn()
          }
        })
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

  const updatePost = async () => {
    if (!user) return
    setLoading(true)
    const action = 'update'

    if (title.length < 3 || title.length > 250) {
      errorToast({
        text: 'Post title must contain 3-250 characters'
      })
      return
    }

    if (content.length < 50 || content.length > 2500) {
      errorToast({
        text: 'Post content must contain 50-2500 characters'
      })
      return
    }

    try {
      const { token } = user

      if (token && isTokenExpired(token)) {
        errorAlert({
          text: 'Your session expired. Please login again'
        })
        setUser(null)
        return
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/posts/${id}?action=${action}`, {
        method: 'PATCH',
        headers: createHeaders(token),
        body: JSON.stringify({ title, content })
      })

      if (response.ok) {
        // Force new posts fetch
        setPosts([])
        setPostsPage(1)
        successAlert({
          text: 'Post updated succesfully',
          successFunction: () => {
            handleReturn()
          }
        })
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

  const handleUpdatePost = () => {
    questionAlert({
      text: 'Are you sure you want to update this post?',
      confirmFunction: () => {
        updatePost()
      },
      cancelFunction: () => {
        return
      }
    })
  }

  const handleDeletePost = () => {
    questionAlert({
      text: 'Are you sure you want to delete this post?',
      confirmFunction: () => {
        deletePost()
      },
      cancelFunction: () => {
        return
      }
    })
  }

  const handleReturn = () => {
    router.push('/')
  }

  useEffect(() => {
    if (user && pageLoading) {
      fetchPost()
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
            onClick={handleUpdatePost}
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Update post'}
          </Button>
          <Button
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
            onClick={handleDeletePost}
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Delete post'}
          </Button>
          <Button
            className="flex items-center justify-center font-semibold py-2 px-4 rounded-md"
            onClick={handleReturn}
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
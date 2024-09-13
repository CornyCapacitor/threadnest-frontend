import { Post } from '@/app/types/dataTypes';
import { postsAtom } from '@/atoms/postsAtom';
import { userAtom } from '@/atoms/userAtom';
import { createHeaders } from '@/utils/createHeaders';
import { isTokenExpired } from '@/utils/isTokenExpired';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useState } from 'react';
import { errorAlert } from '../ui/alerts';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MyTailSpin } from '../ui/tailspin';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const CreatePostCard = () => {
  const [user, setUser] = useAtom(userAtom)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useAtom<Post[]>(postsAtom)

  const createNewPost = async () => {
    setLoading(true)
    setError('')

    if (!user) return

    if (title.length < 3 || title.length > 250) {
      setError('Title must contain 3-50 characters')
      setLoading(false)
      return
    } else if (content.length < 50 || title.length > 2500) {
      setError('Content must contain 50-2500 characters')
      setLoading(false)
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

      const response = await fetch('https://threadnest-backend.onrender.com/api/posts', {
        method: 'POST',
        headers: createHeaders(token),
        body: JSON.stringify({ title, content })
      })

      if (response.ok) {
        const data = await response.json()
        setTitle('')
        setContent('')
        setError(null)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createNewPost()
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md">
      <h1 className="text-2xl font-semibold self-center">
        Here you can add a new thread!
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

      {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}

      <div className="flex gap-4 pt-2">
        <Button
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
          type="submit"
          disabled={loading}
        >
          {loading ? <MyTailSpin size={25} /> : 'Create new post'}
        </Button>
      </div>
    </form>
  );
}

export default CreatePostCard

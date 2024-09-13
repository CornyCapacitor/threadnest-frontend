import { userAtom } from '@/atoms/userAtom'
import { createHeaders } from '@/utils/createHeaders'
import { isTokenExpired } from '@/utils/isTokenExpired'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import { errorAlert } from '../ui/alerts'
import { Button } from '../ui/button'


export const UpvotePostButton = ({ count, isUpvoted, postId }: { count: number, isUpvoted: boolean, postId: string }) => {
  const [user, setUser] = useAtom(userAtom)
  const [upvoted, setUpvoted] = useState(isUpvoted)
  const [upvotesCount, setUpvotesCount] = useState(count)
  const [loading, setLoading] = useState(false)

  const handleUpvote = async (postId: string) => {
    setLoading(true)
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

      // Optimistic update
      setUpvoted(!upvoted);
      setUpvotesCount(prevCount => upvoted ? prevCount - 1 : prevCount + 1);

      const response = await fetch(`https://threadnest-backend.onrender.com/api/posts/${postId}?action=upvote`, {
        method: 'PATCH',
        headers: createHeaders(token)
      })

      if (response.ok) {
        const data = await response.json()

        // Realistic update
        setUpvoted(data.upvoted)
        setUpvotesCount(data.upvotesCount)
      } else {
        const errorData = await response.json()

        // Turning back the optimistic update
        setUpvoted(isUpvoted);
        setUpvotesCount(count);

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
    <Button
      onClick={() => handleUpvote(postId)}
      className={`flex items-center justify-center w-16 rounded-md ${upvoted ? 'bg-green-500 hover:bg-green-600' : ''}`}
      disabled={loading}
    >
      <Image
        src="/upvote.svg"
        alt="Upvote icon"
        width={16}
        height={16}
      />
      <span
        className="font-semibold mt-1"
      >{upvotesCount}
      </span>
    </Button>
  )
}
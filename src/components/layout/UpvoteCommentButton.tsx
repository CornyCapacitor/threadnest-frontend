import { userAtom } from '@/atoms/userAtom'
import { isTokenExpired } from '@/utils/isTokenExpired'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '../ui/button'


export const UpvoteCommentButton = ({ count, isUpvoted, commentId }: { count: number, isUpvoted: boolean, commentId: string }) => {
  const [user, setUser] = useAtom(userAtom)
  const [upvoted, setUpvoted] = useState(isUpvoted)
  const [upvotesCount, setUpvotesCount] = useState(count)
  const [loading, setLoading] = useState(false)

  const handleUpvote = async (postId: string) => {
    console.log(`Upvoting/devoting comment with id: ${commentId}`)
    setLoading(true)
    if (!user) return

    try {
      const { token } = user

      if (token && isTokenExpired(token)) {
        console.log('Token has expired, you should re-login')
        setUser(null)
        return
      }

      // Optimistic update
      setUpvoted(!upvoted);
      setUpvotesCount(prevCount => upvoted ? prevCount - 1 : prevCount + 1);

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/comments/${commentId}?action=upvote`, {
        method: 'PATCH',
        headers: headers
      })

      if (response.ok) {
        const data = await response.json()

        // Realistic update
        setUpvoted(data.upvoted)
        setUpvotesCount(data.upvotesCount)
        console.log('Updated succesfully')

      } else {
        console.error('Fetch failed with status:', response.status)
        const errorData = await response.json()
        console.error('Error data:', errorData)

        // Turning back the optimistic update
        setUpvoted(isUpvoted);
        setUpvotesCount(count);

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
  return (
    <Button
      onClick={() => handleUpvote(commentId)}
      className={`flex items-center justify-center w-16 rounded-md ${upvoted ? 'bg-green-500 hover:bg-green-600' : ''}`}
      disabled={loading}
    >
      <Image
        src="/upvote.svg"
        alt="Upvote icon"
        width={16}
        height={16}
      />
      <span className="font-semibold mt-1">{upvotesCount}</span>
    </Button>
  )
}
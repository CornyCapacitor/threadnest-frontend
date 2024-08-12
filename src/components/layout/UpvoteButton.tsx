import Image from 'next/image'
import { Button } from '../ui/button'

const handleUpvote = async (postId: string) => {
  console.log(`Upvoting/devoting post with id: ${postId}`)
}

export const UpvoteButton = ({ count, isUpvoted, postId }: { count: number, isUpvoted: boolean, postId: string }) => {
  return (
    <Button onClick={() => handleUpvote(postId)} className={`flex items-center justify-center w-16 ${isUpvoted ? 'bg-blue-400 hover:bg-blue-500' : ''}`}>
      <Image src="/upvote.svg" alt="Upvote icon" width={16} height={16} />
      <span className="font-semibold mt-1">{count}</span>
    </Button>
  )
}
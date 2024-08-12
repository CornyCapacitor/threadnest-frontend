import Image from 'next/image'
import { Button } from '../ui/button'

const handleRedirect = (postId: string) => {
  console.log(`Redirecting to post with id: ${postId}`)
}

export const CommentButton = ({ count, postId }: { count: number, postId: string }) => {
  return (
    <Button onClick={() => handleRedirect(postId)} className={'flex items-center justify-center w-16'}>
      <Image src="/comment.svg" alt="Upvote icon" width={16} height={16} />
      <span className="font-semibold mt-1 ml-[1px]">{count}</span>
    </Button>
  )
}
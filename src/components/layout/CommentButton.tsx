import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

export const CommentButton = ({ count, postId }: { count: number, postId: string }) => {
  const router = useRouter()

  const handleRedirect = (postId: string) => {
    router.push(`/post/${postId}`)
  }

  return (
    <Button onClick={() => handleRedirect(postId)} className='flex items-center justify-center w-16 bg-orange-600 hover:bg-orange-700'>
      <Image src="/comment.svg" alt="Upvote icon" width={16} height={16} />
      <span className="font-semibold mt-1 ml-[1px]">{count}</span>
    </Button>
  )
}
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'

export const CommentButton = ({ count, postId, disabled }: { count: number, postId: string, disabled?: boolean }) => {

  return (
    <Link href={`/post/${postId}`}>
      <Button
        className='flex items-center justify-center w-16 bg-orange-600 hover:bg-orange-700'
        disabled={disabled ? true : false}
      >
        <Image
          src="/comment.svg"
          alt="Upvote icon"
          width={16}
          height={16}
        />
        <span
          className="font-semibold mt-1 ml-[1px]"
        >
          {count}
        </span>
      </Button>
    </Link>
  )
}
import { Comment } from '@/app/types/dataTypes'
import { userAtom } from '@/atoms/userAtom'
import { formatDistanceToNow } from 'date-fns'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { Button } from '../ui/button'
import { UpvoteCommentButton } from './UpvoteCommentButton'

const CommentCard = ({ comment }: { comment: Comment }) => {
  const [user, setUser] = useAtom(userAtom)

  return (
    <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md">
      <div className="flex gap-2 justify-between pb-2 border-b border-slate-700">
        <div className="flex gap-2 items-center">
          <Image
            src="/profile.svg"
            alt="Profile picture"
            width={30}
            height={30}
            className="bg-white rounded-full"
          />
          <p className="text-slate-200 font-medium">
            {comment.author_username}
          </p>
          {/* Temporary view */}
          {comment.author_id}
          {/* Temporary view */}
        </div>
        <div className="flex gap-2 items-center">
          {user && user.id === comment.author_id && (
            <Button className="h-6" onClick={() => console.log('Editing comment with id:', comment._id)}>Edit</Button>
          )}
          <p>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
        </div>
      </div>

      <p className="text-slate-300 text-wrap break-all">
        {comment.content}
      </p>

      <div>
        <UpvoteCommentButton
          commentId={comment._id}
          isUpvoted={comment.upvoted}
          count={comment.upvotesCount}
        />
      </div>
    </div>
  )
}

export default CommentCard

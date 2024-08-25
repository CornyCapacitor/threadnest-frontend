import { Comment } from '@/app/types/dataTypes'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { UpvoteCommentButton } from './UpvoteCommentButton'

const CommentCard = ({ comment }: { comment: Comment }) => {
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
        </div>
        <p>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
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

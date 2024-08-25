import { Post } from '@/app/types/dataTypes'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { CommentButton } from './CommentButton'
import { UpvotePostButton } from './UpvotePostButton'

const PostCard = ({ post, disabledCommButton }: { post: Post, disabledCommButton?: boolean }) => {
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
            {post.author_username}
          </p>
          {/* Temporary view */}
          {post.author_id}
          {/* Temporary view */}
        </div>
        <p>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
      </div>

      <p className="text-lg text-slate-100 font-semibold text-wrap break-all">
        {post.title}
      </p>

      <p className="text-slate-300 text-wrap break-all">
        {post.content}
      </p>

      <div className="flex gap-4 pt-2">
        <UpvotePostButton
          postId={post._id}
          isUpvoted={post.upvoted}
          count={post.upvotesCount}
        />
        <CommentButton
          postId={post._id}
          count={post.commentsCount}
          disabled={disabledCommButton}
        />
      </div>
    </div>
  );
}


export default PostCard

import { Post } from '@/app/types/dataTypes'
import { userAtom } from '@/atoms/userAtom'
import { formatDistanceToNow } from 'date-fns'
import { useAtom } from 'jotai'
import { CommentButton } from './CommentButton'
import { UpvotePostButton } from './UpvotePostButton'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'

const PostCard = ({ post, disabledCommButton }: { post: Post, disabledCommButton?: boolean }) => {
  const [user, setUser] = useAtom(userAtom)

  return (
    <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md slide-in">
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
        </div>

        <div className="flex gap-2 items-center">
          {user && user.id == post.author_id && (
            <Link href={`/editPost/${post._id}`}>
              <Button className="h-6 font-semibold">Edit</Button>
            </Link>
          )}
          <p>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
        </div>
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

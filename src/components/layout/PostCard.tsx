import { Post } from '@/app/types/postType'
import Image from 'next/image'
import { CommentButton } from './CommentButton'
import { UpvoteButton } from './UpvoteButton'

type PostCardProps = {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="min-w-[350px] flex flex-col p-5 pb-2 border-solid border-slate-400 border rounded-lg w-full gap-2">
      <div className="flex gap-2 items-center justify-start pb-2 border-b border-slate-400 border-solid">
        <Image src="/profile.svg" alt="Profile picture" width={30} height={30} className="bg-white rounded-full" />
        <p>{post.author_username}</p>
      </div>
      <p className="border-b border-slate-400 border-solid pb-2">{post.title}</p>
      <p className="border-b border-slate-400 border-solid pb-2">{post.content}</p>
      <div className="flex gap-2">
        <UpvoteButton postId={post._id} isUpvoted={post.upvoted} count={post.upvotesCount} />
        <CommentButton postId={post._id} count={post.commentsCount} />
      </div>
    </div>
  )
}

export default PostCard

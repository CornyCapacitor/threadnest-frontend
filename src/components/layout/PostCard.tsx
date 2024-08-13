import { Post } from '@/app/types/postType'
import Image from 'next/image'
import { CommentButton } from './CommentButton'
import { UpvoteButton } from './UpvoteButton'

type PostCardProps = {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md">
      <div className="flex gap-2 items-center pb-2 border-b border-slate-700">
        <Image src="/profile.svg" alt="Profile picture" width={30} height={30} className="bg-white rounded-full" />
        <p className="text-slate-200 font-medium">{post.author_username}</p>
      </div>
      <p className="text-lg text-slate-100 font-semibold">{post.title}</p>
      <p className="text-slate-300">{post.content}</p>
      <div className="flex gap-4 pt-2">
        <UpvoteButton postId={post._id} isUpvoted={post.upvoted} count={post.upvotesCount} />
        <CommentButton postId={post._id} count={post.commentsCount} />
      </div>
    </div>
  );
}


export default PostCard

import { Post } from '@/app/types/postType'
import { CommentButton } from './CommentButton'
import { UpvoteButton } from './UpvoteButton'

type PostCardProps = {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="flex flex-col border-white border w-full p-2 gap-2">
      <p>{post.author_username}</p>
      <p>{post.title}</p>
      <p>{post.content}</p>
      <div className="flex gap-2">
        <UpvoteButton postId={post._id} isUpvoted={post.upvoted} count={post.upvotesCount} />
        <CommentButton postId={post._id} count={post.commentsCount} />
      </div>
    </div>
  )
}

export default PostCard

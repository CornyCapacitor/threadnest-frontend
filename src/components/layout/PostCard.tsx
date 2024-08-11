import { Post } from '@/app/types/postType'

type PostCardProps = {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="flex flex-col border-white border w-full">
      <p>{post.author_username}</p>
      <p>{post.title}</p>
      <p>{post.content}</p>
      <div className="flex gap-2">
        <button className={`${post.upvoted ? 'bg-green-300' : ''}`}>Upv: {post.upvotesCount}</button>
        <button>Com: {post.commentsCount}</button>
      </div>
    </div>
  )
}

export default PostCard

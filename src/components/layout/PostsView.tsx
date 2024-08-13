import { postsAtom } from '@/atoms/postsAtom'
import { useAtom } from 'jotai'
import PostCard from './PostCard'

const PostsView = () => {
  const [posts, setPosts] = useAtom(postsAtom)

  return (
    <div className="flex flex-col gap-2">
      {posts && posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}

export default PostsView

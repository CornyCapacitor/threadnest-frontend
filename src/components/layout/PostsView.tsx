import { postsAtom } from '@/atoms/postsAtom'
import { useAtom } from 'jotai'
import PostCard from './PostCard'

const PostsView = () => {
  const [posts, setPosts] = useAtom(postsAtom)

  return (
    <main className="flex flex-col flex-grow items-start justify-center p-24 gap-2">
      {posts && posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </main>
  )
}

export default PostsView

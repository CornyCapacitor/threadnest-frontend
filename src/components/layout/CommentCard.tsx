import { Comment } from '@/app/types/dataTypes'
import { commentsAtom } from '@/atoms/commentsAtom'
import { userAtom } from '@/atoms/userAtom'
import { isTokenExpired } from '@/utils/isTokenExpired'
import { formatDistanceToNow } from 'date-fns'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import { questionAlert } from '../ui/alerts'
import { Button } from '../ui/button'
import { MyTailSpin } from '../ui/tailspin'
import { Textarea } from '../ui/textarea'
import { errorToast, successToast } from '../ui/toasts'
import { UpvoteCommentButton } from './UpvoteCommentButton'

const CommentCard = ({ comment }: { comment: Comment }) => {
  const [user, setUser] = useAtom(userAtom)
  const [, setComments] = useAtom(commentsAtom)
  const [commentLoading, setCommentLoading] = useState(false)
  const [editContent, setEditContent] = useState<string>('')
  const [editMode, setEditMode] = useState(false)

  const deleteComment = async (id: string) => {
    console.log('Deleting comment')
    if (!user) return

    try {
      setCommentLoading(true)

      const { token } = user

      if (token && isTokenExpired(token)) {
        console.log('Token has expired, you should re-login')
        setUser(null)
        return
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/comments/${id}`, {
        method: 'DELETE',
        headers: headers,
      })

      if (response.ok) {
        const data = await response.json();
        setEditMode(false)
        setComments(prevComments =>
          prevComments.filter(comment => comment._id !== id)
        )
        successToast({
          text: data.message
        })
      } else {
        const data = await response.json()
        console.log(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setCommentLoading(false)
    }
  }

  const updateComment = async (id: string, content: string) => {
    console.log('Updating comment')
    if (!user) return

    if (editContent.length > 500) {
      errorToast({
        text: 'Comment cannot exceed 500 characters'
      })
      return
    }

    if (!editContent) {
      errorToast({
        text: 'Comment cannot be empty'
      })
      return
    }

    try {
      setCommentLoading(true)
      const action = 'update'

      const { token } = user

      if (token && isTokenExpired(token)) {
        console.log('Token has expired, you should re-login')
        setUser(null)
        return
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/comments/${id}?action=${action}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        const data = await response.json();
        setEditMode(false)
        setEditContent('')
        setComments(prevComments =>
          prevComments.map(comment =>
            comment._id === id ? { ...comment, content: data.content } : comment
          )
        )
        successToast({
          text: 'Comment updated succesfully'
        })
      } else {
        const data = await response.json()
        console.log(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = (id: string) => {
    questionAlert({
      text: 'Are you sure you want to delete this comment?',
      confirmFunction: () => {
        deleteComment(id)
      },
      cancelFunction: () => {
        return
      }
    })
  }

  return (
    <div className={`min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md ${commentLoading ? 'opacity-50 pointer-events-none' : 'slide-in'}`}>
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
            <Button className="h-6 font-semibold" onClick={() => { setEditMode(!editMode); setEditContent(comment.content) }} disabled={commentLoading}>{editMode ? 'Cancel' : 'Edit'}</Button>
          )}
          {editMode &&
            <>
              <Button className="h-6 bg-red-500 hover:bg-red-600 text-slate-100 font-semibold" onClick={() => handleDeleteComment(comment._id)} disabled={commentLoading}>Delete</Button>
              <Button className="h-6 bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold" onClick={() => updateComment(comment._id, editContent)} disabled={commentLoading}>Save</Button>
            </>
          }
          <p>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
        </div>
      </div>

      <p className="text-slate-300 text-wrap break-all">
        {editMode && !commentLoading ? (
          <Textarea className="" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
        ) : editMode && commentLoading ? (
          <div className="flex items-center justify-center">
            <MyTailSpin size={100} />
          </div>
        ) : (
          comment.content
        )}
      </p>

      {!commentLoading &&
        <div>
          <UpvoteCommentButton
            commentId={comment._id}
            isUpvoted={comment.upvoted}
            count={comment.upvotesCount}
          />
        </div>
      }
    </div>
  )
}

export default CommentCard

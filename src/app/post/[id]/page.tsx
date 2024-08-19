'use client'

import { userAtom } from "@/atoms/userAtom"
import { MyTailSpin } from "@/components/ui/tailspin"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const PostPage = ({ params }: { params: { id: string } }) => {
  const [user] = useAtom(userAtom)
  const [pageLoading, setPageLoading] = useState(true)
  const { id } = params

  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      setPageLoading(false)
    } else {
      setPageLoading(false)
    }
  }, [user])

  if (pageLoading) {
    return (
      <main className="flex flex-grow flex-col items-center justify-center p-24">
        <MyTailSpin size={50} />
      </main>
    )
  }

  if (!user) {
    return router.push('/')
  }

  return (
    <main className="flex flex-grow items-center justify-center p-24">
      <h1>Post id: {id}</h1>
    </main>
  )
}

export default PostPage

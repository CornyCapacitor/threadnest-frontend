import { Button } from "@/components/ui/button"

import { userAtom } from "@/atoms/userAtom"
import { isTokenExpired } from "@/utils/isTokenExpired"

import { errorAlert, questionAlert, successAlert } from "@/components/ui/alerts"
import { MyTailSpin } from "@/components/ui/tailspin"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const DeleteAccount = () => {
  const [user, setUser] = useAtom(userAtom)

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const deleteAccount = async () => {
    if (!user) return

    try {
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

      const response = await fetch('https://threadnest-backend.onrender.com/api/users', {
        method: 'DELETE',
        headers: headers
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        successAlert({
          text: 'Account deleted succesfully',
          successFunction: () => {
            setUser(null)
            router.push('/')
          }
        })
      }
    } catch (error) {
      errorAlert({
        text: `${error}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    questionAlert({
      text: 'Are you sure you want to delete your account? This action is irreversible.',
      confirmFunction: () => {
        deleteAccount()
      },
      cancelFunction: () => {
        setLoading(false)
        return
      }
    })
  }

  return (
    <form onSubmit={handleDeleteAccount} className="flex flex-col gap-2">
      <p className="text-red-600">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
      <Button className="w-48 flex items-center justify-center bg-red-500 hover:bg-red-600 text-slate-100 font-semibold py-2 px-4 rounded-md" disabled={loading} type="submit">{loading ? <MyTailSpin size={25} /> : 'Delete account'}</Button>
    </form>
  )
}
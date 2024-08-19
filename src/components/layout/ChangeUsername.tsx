import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MyTailSpin } from "@/components/ui/tailspin"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { userAtom } from "@/atoms/userAtom"
import { isTokenExpired } from "@/utils/isTokenExpired"

import { useAtom } from "jotai"
import { useState } from "react"

import { errorAlert, questionAlert, successAlert } from "@/components/ui/alerts"
import Image from "next/image"

export const ChangeUsername = () => {
  const [user, setUser] = useAtom(userAtom)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newUsername, setNewUsername] = useState('')
  const [newUsernameRepeat, setNewUsernameRepeat] = useState('')

  const changeUsername = async () => {
    const action = 'username'

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

      const response = await fetch(`https://threadnest-backend.onrender.com/api/users?action=${action}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ username: newUsername })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        successAlert({
          text: 'Username updated succesfully!',
          successFunction: () => {
            setUser({ email: user.email, token: user.token, username: newUsername })
            setNewUsername('')
            setNewUsernameRepeat('')
            setError(null)
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

  const validateUsername = () => {
    setError(null)

    if (!newUsername) {
      setError('Username field cannot be empty')
      setLoading(false)
      return false
    } else if (newUsername !== newUsernameRepeat) {
      setError('Usernames do not match')
      setLoading(false)
      return false
    } else if (newUsername.length < 3) {
      setError('Username is too short')
      setLoading(false)
      return false
    } else if (newUsername.length > 30) {
      setError('Username is too long')
      setLoading(false)
      return false
    }

    setError(null)
    return true
  }

  const handleChangeUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    if (validateUsername()) {
      questionAlert({
        text: `Are you sure you want to be called "${newUsername}" now?`,
        confirmFunction: () => {
          changeUsername()
        },
        cancelFunction: () => {
          setLoading(false)
          return
        }
      })
    }
  }

  return (
    <form onSubmit={handleChangeUsername} className="flex flex-col gap-2 py-1 ml-2 max-w-[90%]">
      <label htmlFor="new-username" className="flex gap-2 text-slate-200 font-semibold">
        New username
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Image src="danger.svg" alt="Tooltip icon" width={18} height={18} className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Username must contain 3-30 characters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </label>
      <Input id="new-username" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} disabled={loading} />
      <label htmlFor="new-username-repeat" className="flex text-slate-200 font-semibold">
        Repeat new username
      </label>
      <Input id="new-username-repeat" type="text" value={newUsernameRepeat} onChange={(e) => setNewUsernameRepeat(e.target.value)} disabled={loading} />

      {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}

      <Button className="w-48 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
        disabled={loading}>{loading ? <MyTailSpin size={25} /> : 'Change Username'}</Button>
    </form>
  )
}
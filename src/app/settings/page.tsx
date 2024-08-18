'use client'

import { userAtom } from "@/atoms/userAtom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MyTailSpin } from "@/components/ui/tailspin"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { isTokenExpired } from "@/utils/isTokenExpired"
import { useAtom } from "jotai"
import { useState } from "react"

import Image from "next/image"
import validator from "validator"

const SettingsPage = () => {
  const [user, setUser] = useAtom(userAtom)
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState(false)

  const [newUsername, setNewUsername] = useState('')
  const [newUsernameRepeat, setNewUsernameRepeat] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const changeUsername = async () => {
    const action = 'username'

    setLoading(true)
    setError('')

    if (!user) return

    if (!newUsername) {
      setError('Username field cannot be empty')
      setLoading(false)
      return
    } else if (newUsername !== newUsernameRepeat) {
      setError('Usernames do not match')
      setLoading(false)
      return
    } else if (newUsername.length < 3) {
      setError('Username is too short')
      setLoading(false)
      return
    } else if (newUsername.length > 30) {
      setError('Username is too long')
      setLoading(false)
      return
    }

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
        console.log('Username updated succesfully')
        const data = await response.json()
        console.log(data)
        setUser({ email: user.email, token: user.token, username: newUsername })
        setNewUsername('')
        setNewUsernameRepeat('')
        setError(null)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    const action = 'password'

    setLoading(true)
    setError('')

    if (!user) return

    if (!newPassword) {
      setError('Password field cannot be empty')
      setLoading(false)
      return
    } else if (newPassword !== newPasswordRepeat) {
      setError('Passwords do not match')
      setLoading(false)
      return
    } else if (!validator.isStrongPassword(newPassword)) {
      setError('Password not strong enough')
      setLoading(false)
      return
    }

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
        body: JSON.stringify({ password: newPassword })
      })

      if (response.ok) {
        console.log('Password updated succesfully')
        const data = await response.json()
        console.log(data)
        setNewPassword('')
        setNewPasswordRepeat('')
        setError(null)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async () => {
    console.log('Deleting user')

    setLoading(true)
    setError('')

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
        console.log('User deleted succesfully')
        const data = await response.json()
        console.log(data)
        setUser(null)
        console.log('User deleted, logging off')
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    changeUsername()
  }

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    changePassword()
  }

  if (user) return (
    <main className="flex flex-grow flex-col items-center justify-center w-full gap-2">
      <h1 className="text-center text-2xl">What account action would you like to take?</h1>
      <div className="min-w-[350px] w-[60%] flex flex-col p-5 rounded-lg gap-5 bg-slate-900 border border-slate-700 shadow-md">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger onClick={() => setError(null)}>Change username</AccordionTrigger>
            <AccordionContent>
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
                <Input id="new-username" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                <label htmlFor="new-username-repeat" className="flex text-slate-200 font-semibold">
                  Repeat new username
                </label>
                <Input id="new-username-repeat" type="text" value={newUsernameRepeat} onChange={(e) => setNewUsernameRepeat(e.target.value)} />

                {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}

                <Button
                  className="w-48 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <MyTailSpin size={25} /> : 'Change username'}
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger onClick={() => setError(null)}>Change password</AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-2 py-1 ml-2 max-w-[90%]">
                <label htmlFor="new-password" className="flex gap-2 text-slate-200 font-semibold">
                  New password
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Image src="danger.svg" alt="Tooltip icon" width={18} height={18} className="cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                <Input id="new-password" type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <label htmlFor="new-password-repeat" className="flex text-slate-200 font-semibold">
                  Repeat new password
                </label>
                <Input id="new-password-repeat" type={showPasswords ? 'text' : 'password'} value={newPasswordRepeat} onChange={(e) => setNewPasswordRepeat(e.target.value)} />
                <p
                  className="text-sm text-blue-400 cursor-pointer mt-1 self-start"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? 'Hide passwords' : 'Show passwords'}
                </p>

                {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}

                <Button
                  className="w-48 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <MyTailSpin size={25} /> : 'Change password'}
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger onClick={() => setError(null)}>Delete account</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                <p>Deleting your account will also delete all your related posts, comments and upvotes. Make sure it is considered decision.</p>
                <p>Are you sure you want to delete your account? This change is irreversible!</p>
                <Button
                  className="w-48 flex items-center justify-center bg-red-500 hover:bg-red-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
                  onClick={() => deleteUser()}
                  disabled={loading}
                >
                  {loading ? <MyTailSpin size={25} /> : 'Delete account'}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  )

  if (!user) return (
    <main className="flex flex-grow items-center justify-center p-24">
      <h1 className="text-3xl">In order to access setting you must be logged in</h1>
    </main>
  )
}

export default SettingsPage

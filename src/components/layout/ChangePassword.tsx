import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { userAtom } from "@/atoms/userAtom"
import { isTokenExpired } from "@/utils/isTokenExpired"

import { useAtom } from "jotai"
import { useState } from "react"

import { errorAlert, questionAlert, successAlert } from '@/components/ui/alerts'
import { Button } from '@/components/ui/button'
import { MyTailSpin } from '@/components/ui/tailspin'
import { createHeaders } from '@/utils/createHeaders'
import Image from "next/image"
import validator from "validator"

export const ChangePassword = () => {
  const [user, setUser] = useAtom(userAtom)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const changePassword = async () => {
    const action = 'password'

    if (!user) return

    try {
      const { token } = user

      if (token && isTokenExpired(token)) {
        errorAlert({
          text: 'Your session expired. Please login again'
        })
        setUser(null)
        return
      }

      const response = await fetch(`https://threadnest-backend.onrender.com/api/users?action=${action}`, {
        method: 'PATCH',
        headers: createHeaders(token),
        body: JSON.stringify({ password: newPassword })
      })

      if (response.ok) {
        const data = await response.json()
        successAlert({
          text: 'Password updated succesfully!',
          successFunction: () => {
            setNewPassword('')
            setNewPasswordRepeat('')
            setError(null)
          }
        })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const validatePassword = () => {
    setError(null)

    if (!newPassword) {
      setError('Password field cannot be empty')
      setLoading(false)
      return false
    } else if (newPassword !== newPasswordRepeat) {
      setError('Passwords do not match')
      setLoading(false)
      return false
    } else if (!validator.isStrongPassword(newPassword)) {
      setError('Password not strong enough')
      setLoading(false)
      return false
    }

    setError(null)
    return true
  }

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    if (validatePassword()) {
      questionAlert({
        text: 'Are you sure you want to change your password?',
        confirmFunction: () => {
          changePassword()
        },
        cancelFunction: () => {
          setLoading(false)
          return
        }
      })
    }
  }

  return (
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
      <Input id="new-password" type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} />
      <label htmlFor="new-password-repeat" className="flex text-slate-200 font-semibold">
        Repeat new password
      </label>
      <Input id="new-password-repeat" type={showPasswords ? 'text' : 'password'} value={newPasswordRepeat} onChange={(e) => setNewPasswordRepeat(e.target.value)} disabled={loading} />
      <p
        className="text-sm text-blue-400 cursor-pointer mt-1 self-start"
        onClick={() => setShowPasswords(!showPasswords)}
      >
        {showPasswords ? 'Hide passwords' : 'Show passwords'}
      </p>

      {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}

      <Button className="w-48 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md" type="submit" disabled={loading}>{loading ? <MyTailSpin size={25} /> : 'Change password'}</Button>
    </form>
  )
}
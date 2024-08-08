'use client'

import { userAtom } from "@/atoms/userAtom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MyTailSpin } from "@/components/ui/tailspin"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useState } from "react"
import validator from 'validator'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useAtom(userAtom)

  const router = useRouter()

  const loginUser = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    if (!email || !password) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (!validator.isEmail(email)) {
      setError('Email is not valid')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('https://threadnest-backend.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data)
        setEmail('')
        setPassword('')
        setShowPassword(false)
        setError(null)
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occured, please try again later')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    loginUser(email, password)
  }

  const handleRedirect = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    router.push('/signup')
  }

  if (!user) return (
    <main className="flex flex-grow flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="flex flex-col items-center min-w-[350px] p-5 border-solid border-slate-400 border rounded-lg">
        <h1 className="text-2xl">Login</h1>
        <label htmlFor="email" className="self-start text-xs mt-5">Email</label>
        <Input type="email" placeholder="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-slate-400" disabled={loading} />
        <label htmlFor="password" className="self-start text-xs mt-2">Password</label>
        <Input type={showPassword ? "text" : "password"} placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-slate-400" disabled={loading} />
        <p className="text-xs self-end ml-1 mt-1 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide password' : 'Show password'}</p>
        <Button id="login" type="submit" className="w-[50%] mt-5" disabled={loading}>
          {loading ? (
            <MyTailSpin size={25} />
          ) : (
            'Login'
          )}
        </Button>
        {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}
        <p className="text-xs mt-5">New user? Sign up now!</p>
        <Button id="signup" onClick={handleRedirect} className="w-[50%] mt-1" disabled={loading}>
          {loading ? (
            <MyTailSpin size={25} />
          ) : (
            'To signup page'
          )}
        </Button>
      </form>
    </main>
  )

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center min-w-[350px] p-5 border-solid border-slate-400 border rounded-lg">
        <h1>Hello again {user.username}!</h1>
        <Button onClick={() => setUser(null)} className="w-[50%] mt-5">Logout</Button>
      </div>
    </main>
  )
}

export default LoginPage
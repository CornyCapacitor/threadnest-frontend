'use client'

import { userAtom } from "@/atoms/userAtom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MyTailSpin } from "@/components/ui/tailspin"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import validator from "validator"

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [username, setUsername] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useAtom(userAtom)

  const router = useRouter()

  const signupUser = async (email: string, password: string, username: string) => {
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

    if (!validator.isStrongPassword(password)) {
      setError('Password not strong enough')
      setLoading(false)
      return
    }

    if (password !== passwordRepeat) {
      setError('Passwords are not equal')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('https://threadnest-backend.onrender.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setUser(data)
        setEmail('')
        setPassword('')
        setPasswordRepeat('')
        setUsername('')
        setShowPasswords(false)
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

    signupUser(email, password, username)
  }

  const handleRedirect = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    router.push('/login')
  }

  useEffect(() => {
    if (user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="flex flex-col items-center min-w-[350px] p-5 border-solid border-slate-400 border rounded-lg">
        <h1 className="text-2xl">Signup</h1>
        <label htmlFor="email" className="self-start text-xs mt-5">Email</label>
        <Input type="email" placeholder="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-slate-400" />
        <label htmlFor="username" className="self-start text-xs mt-2">Username</label>
        <Input type="text" placeholder="Username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="border-slate-400" />
        <label htmlFor="password" className="self-start text-xs mt-2">Password</label>
        <Input type={showPasswords ? "text" : "password"} placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-slate-400" />
        <label htmlFor="passwordRepeat" className="self-start text-xs mt-2">Repeat password</label>
        <Input type={showPasswords ? "text" : "password"} placeholder="Repeat password" id="passwordRepeat" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} className="border-slate-400" />
        <p className="text-xs self-end ml-1 mt-1 cursor-pointer" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? 'Hide passwords' : 'Show passwords'}</p>
        <Button type="submit" className="w-[50%] mt-5" disabled={loading}>
          {loading ? (
            <MyTailSpin size={25} />
          ) : (
            'Signup'
          )}
        </Button>
        {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}
        <p className="text-xs mt-5">Already have an account? Log in here!</p>
        <Button id="login" onClick={handleRedirect} className="w-[50%] mt-1" disabled={loading}>
          {loading ? (
            <MyTailSpin size={25} />
          ) : (
            'To login page'
          )}
        </Button>
      </form>
    </main>
  )
}

export default SignupPage
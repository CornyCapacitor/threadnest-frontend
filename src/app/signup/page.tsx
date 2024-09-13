'use client'

import { postsAtom } from "@/atoms/postsAtom"
import { userAtom } from "@/atoms/userAtom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MyTailSpin } from "@/components/ui/tailspin"
import { errorToast } from "@/components/ui/toasts"
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
  const [pageLoading, setPageLoading] = useState(true)
  const [user, setUser] = useAtom(userAtom)
  const [posts, setPosts] = useAtom(postsAtom)

  const router = useRouter()

  const signupUser = async (email: string, password: string, username: string) => {
    setLoading(true)
    setError(null)
    setPosts([])

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
      errorToast({
        text: `${error}`
      })
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

  if (user) {
    return router.push('/')
  }

  return (
    <main className="flex flex-grow flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="flex flex-col items-center min-w-[350px] p-6 bg-slate-800 border border-slate-700 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-slate-100">Signup</h1>

        <label htmlFor="email" className="self-start text-sm text-slate-200 mt-4">Email</label>
        <Input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <label htmlFor="username" className="self-start text-sm text-slate-200 mt-4">Username</label>
        <Input
          type="text"
          placeholder="Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <label htmlFor="password" className="self-start text-sm text-slate-200 mt-4">Password</label>
        <Input
          type={showPasswords ? "text" : "password"}
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <label htmlFor="passwordRepeat" className="self-start text-sm text-slate-200 mt-4">Repeat Password</label>
        <Input
          type={showPasswords ? "text" : "password"}
          placeholder="Repeat Password"
          id="passwordRepeat"
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
          className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <p
          className="text-sm text-blue-400 cursor-pointer mt-1 self-start"
          onClick={() => setShowPasswords(!showPasswords)}
        >
          {showPasswords ? 'Hide passwords' : 'Show passwords'}
        </p>

        <Button
          type="submit"
          className="w-full mt-5 bg-green-500 hover:bg-green-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? <MyTailSpin size={25} /> : 'Signup'}
        </Button>

        {error && <h1 className="text-sm mt-2 text-red-500">{error}</h1>}

        <p className="text-xs text-slate-200 mt-5">Already have an account? Log in here!</p>
        <Button
          id="login"
          onClick={handleRedirect}
          className="w-full mt-1 bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? <MyTailSpin size={25} /> : 'To login page'}
        </Button>
      </form>
    </main>
  )
}

export default SignupPage
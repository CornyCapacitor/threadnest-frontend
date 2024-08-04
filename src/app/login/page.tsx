'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch('https://threadnest-backend.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log(response.body)

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        console.log('Token:', token);
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!email || !password) {
      console.log('No email nor password')
      return
    }

    loginUser(email, password)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-[300px] min-w-[350px] p-5 border-solid border-slate-400 border rounded-lg">
        <h1 className="text-2xl">Login</h1>
        <label htmlFor="email" className="self-start text-xs mt-5">Email</label>
        <Input type="email" placeholder="Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-slate-400" />
        <label htmlFor="password" className="self-start text-xs mt-2">Password</label>
        <Input type={showPassword ? "text" : "password"} placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-slate-400" />
        <p className="text-xs self-end ml-1 mt-1 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>Show password</p>
        <Button type="submit" className="w-[50%] mt-5">Login</Button>
      </form>
    </main>
  )
}

export default LoginPage
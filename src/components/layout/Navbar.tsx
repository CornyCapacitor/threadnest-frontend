'use client'

import { userAtom } from '@/atoms/userAtom'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { Button } from "../ui/button"

export const Navbar = () => {
  const [user, setUser] = useAtom(userAtom)

  return (
    <nav className="flex border-b border-solid border-slate-400 items-center justify-between py-2">
      <Link href="/">
        <h1 className="text-3xl px-4 py-2">
          ThreadNest {user ? '(logged)' : '(not logged)'}
        </h1>
      </Link>
      <div className="flex p-2 gap-3">
        {user ? (
          <Button className="w-20" onClick={() => setUser(null)}>Logout</Button>
        ) : (
          <>
            <Link href="/login">
              <Button className="w-20">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="w-20">Signup</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
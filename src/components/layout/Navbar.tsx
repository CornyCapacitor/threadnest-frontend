'use client'

import { userAtom } from '@/atoms/userAtom'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "../ui/button"
import { successToast } from '../ui/toasts'

export const Navbar = () => {
  const [user, setUser] = useAtom(userAtom)

  const handleLogout = () => {
    setUser(null)

    successToast({
      text: 'Logging out'
    })
  }

  return (
    <nav className="flex border-b border-solid border-slate-400 items-center justify-between py-2 px-2">
      <Link href="/" className="flex p-2">
        <Image src="threadnest.svg" alt="Threadnest logo" width={40} height={40} />
        <h1 className="text-3xl px-4 font-mono hidden md:block"> {/* Width of "w-10" is set temporarily for coding purpose */}
          ThreadNest {user && <span className="text-blue-500">{user.username}</span>}
        </h1>
      </Link>
      <div className="flex p-2 gap-3">
        {user ? (
          <>
            <Link href="/settings">
              <Button className="w-20 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md">Settings</Button>
            </Link>
            <Button className="w-20 bg-red-500 hover:bg-red-600 text-slate-100 font-semibold py-2 px-4 rounded-md" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button className="w-20 bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="w-20 bg-green-500 hover:bg-green-600 text-slate-100 font-semibold py-2 px-4 rounded-md">Signup</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
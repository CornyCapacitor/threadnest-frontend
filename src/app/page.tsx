'use client'

import { userAtom } from "@/atoms/userAtom";
import { useAtom } from "jotai";

export default function Home() {
  const [user, setUser] = useAtom(userAtom)

  if (user) return (
    <main className="flex flex-grow items-center justify-center p-24">
      <h1 className="text-3xl">Hello again <span className="text-blue-500">{user.username}</span></h1>
    </main>
  )

  return (
    <main className="flex flex-grow items-center justify-center p-24">
      <h1 className="text-3xl">ThreadNest App</h1>
    </main>
  );
}

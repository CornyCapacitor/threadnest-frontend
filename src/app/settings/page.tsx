'use client'

import { userAtom } from "@/atoms/userAtom"
import { ChangePassword } from "@/components/layout/ChangePassword"
import { ChangeUsername } from "@/components/layout/ChangeUsername"
import { DeleteAccount } from "@/components/layout/DeleteAccount"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MyTailSpin } from "@/components/ui/tailspin"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const SettingsPage = () => {
  const [pageLoading, setPageLoading] = useState(true)
  const [user] = useAtom(userAtom)

  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      setPageLoading(false)
    } else {
      setPageLoading(false)
    }
  }, [user])

  if (pageLoading) return (
    <main className="flex flex-grow items-center justify-center p-24">
      <MyTailSpin size={50} />
    </main>
  )

  if (!user) {
    return router.push('/')
  }

  return (
    <main className="flex flex-grow flex-col items-center justify-center w-full gap-2">
      <h1 className="text-center text-2xl">What account action would you like to take?</h1>
      <div className="min-w-[350px] w-[60%] flex flex-col p-5 rounded-lg gap-5 bg-slate-900 border border-slate-700 shadow-md">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Change username</AccordionTrigger>
            <AccordionContent>
              <ChangeUsername />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Change password</AccordionTrigger>
            <AccordionContent>
              <ChangePassword />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Delete account</AccordionTrigger>
            <AccordionContent>
              <DeleteAccount />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  )
}

export default SettingsPage

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = React.useState<string | null>(null)

  React.useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
  }, [router])

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <h1 className="text-4xl font-bold mb-8">Welcome to Beverage Store</h1>
      <p className="text-xl mb-8">
        Logged in as: <span className="font-mono text-primary">{user}</span>
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            localStorage.removeItem("currentUser")
            router.push("/login")
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}



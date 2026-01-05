"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
  type: "login" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call based on the logic in the provided app.js
    const target = event.target as typeof event.target & {
      username: { value: string }
      password: { value: string }
    }
    const username = target.username.value
    const _password = target.password.value

    setTimeout(() => {
      setIsLoading(false)
      // Mocking the behavior from the user's script
      localStorage.setItem("currentUser", username)
      router.push("/")
    }, 1000)
  }

  return (
    <div className="grid gap-6">
      <Card className="border-border bg-black/50 backdrop-blur-xl text-card-foreground shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-black tracking-tighter uppercase italic">
            {type === "login" ? "Welcome back" : "Join the power"}
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 font-medium">
            {type === "login" ? "Fuel your day. Enter your credentials." : "Feel the power. Create your account today."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="beverage_enthusiast"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                disabled={isLoading}
                required
                className="bg-white/5 border-white/10 h-12 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                title="Password"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                required
                className="bg-white/5 border-white/10 h-12 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full h-12 text-base font-bold uppercase tracking-tighter bg-primary hover:bg-primary/90 text-white transition-all transform active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {type === "login" ? "Sign In" : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {type === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    className="p-0 h-auto text-primary font-bold hover:no-underline bg-transparent border-0 cursor-pointer"
                    onClick={() => router.push("/signup")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="p-0 h-auto text-primary font-bold hover:no-underline bg-transparent border-0 cursor-pointer"
                    onClick={() => router.push("/login")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

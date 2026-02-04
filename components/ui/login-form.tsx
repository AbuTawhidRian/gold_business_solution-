"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { authenticate } from "@/actions/login"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Sign in
    </Button>
  )
}

export function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)

  return (
    <Card className="w-full max-w-sm border-slate-700 bg-slate-800/50 backdrop-blur-sm text-slate-100 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-amber-500">Login</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-amber-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-amber-500"
            />
          </div>
          <LoginButton />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <p className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

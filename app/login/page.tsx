import { LoginForm } from "@/components/ui/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4">
      <div className="relative z-10">
        <LoginForm />
      </div>
      {/* Background Gradient/Decoration if needed */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
    </div>
  )
}

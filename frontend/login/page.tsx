import { AuthForm } from "@/components/auth-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login | Drink Good",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 selection:bg-primary selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[180px] rounded-full animate-pulse" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-8 max-w-7xl mx-auto w-full z-20">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <span className="text-3xl font-black text-white italic tracking-tighter uppercase">Drink</span>
          <span className="text-3xl font-black text-primary italic tracking-tighter uppercase underline decoration-4 underline-offset-8 transition-all group-hover:underline-offset-4">
            Good
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.3em] text-white/50">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Impact
          </Link>
        </nav>
      </header>

      <div className="relative w-full max-w-[440px] z-10">
        <div className="flex flex-col items-center space-y-6 text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-bounce">
            Access Portal
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85] text-balance">
            That&apos;s What
            <br />
            <span className="text-primary text-glow italic">I Like</span>
          </h1>
        </div>
        <AuthForm type="login" />
      </div>
    </div>
  )
}

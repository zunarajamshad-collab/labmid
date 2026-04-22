'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Refresh to update auth state and redirect
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-effect p-8 rounded-3xl border border-border shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-foreground">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to your AdFlow Pro account</p>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium" htmlFor="password">Password</label>
              <Link href="/auth/forgot" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          Don&apos;t have an account? <Link href="/auth/register" className="text-primary hover:underline font-medium">Create one</Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account')

      // 2. Create profile record (usually handled by DB trigger, but ensuring here)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: 'client',
          status: 'active'
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // We don't throw here if the user was already created in auth
      }

      // 3. Create seller profile
      await supabase.from('seller_profiles').insert({
        user_id: authData.user.id,
        display_name: fullName,
      })

      // Redirect to login or home
      router.push('/auth/login?message=Account created! Please sign in.')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md glass-effect p-8 rounded-3xl border border-border shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-foreground">Create an Account</h1>
        <p className="text-center text-muted-foreground mb-8">Join AdFlow Pro and start posting ads</p>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe" 
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
              required
            />
          </div>
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
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

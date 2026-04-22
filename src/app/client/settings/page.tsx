'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ClientSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [initialEmail, setInitialEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    async function loadProfile() {
      // Use getSession for immediate session check
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session || !session.user) {
        setLoading(false)
        return
      }

      const user = session.user
      setEmail(user.email || '')
      setInitialEmail(user.email || '')

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setFullName(profile.full_name || '')
      }

      // Get seller profile
      const { data: seller } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (seller) {
        setBusinessName(seller.business_name || '')
        setPhone(seller.phone || '')
        setCity(seller.city || '')
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Re-verify session before saving
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !session.user) {
        throw new Error('Your session has expired. Please log in again.')
      }
      
      const user = session.user

      // 1. Update Email if changed
      if (email !== initialEmail && email.trim() !== '') {
        const { error: authError } = await supabase.auth.updateUser({ email })
        if (authError) throw authError
        setMessage({ type: 'warning', text: 'Profile updated. Please check both your old and new email for confirmation links to complete the email change.' })
      }

      // 2. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)
      
      if (profileError) throw profileError

      // 3. Update Seller Profile
      const { error: sellerError } = await supabase
        .from('seller_profiles')
        .upsert({
          user_id: user.id,
          display_name: fullName,
          business_name: businessName,
          phone: phone,
          city: city,
          updated_at: new Date().toISOString()
        })
      
      if (sellerError) throw sellerError

      if (!message) {
        setMessage({ type: 'success', text: 'Account settings updated successfully!' })
      }
    } catch (err: any) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to update settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your personal information and security preferences.</p>
      </header>

      {message && (
        <div className={`mb-8 p-6 rounded-3xl flex items-start gap-4 border shadow-sm ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
          message.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
          'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          <div className="mt-1">
            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <span className="font-bold block mb-1">{message.type.toUpperCase()}</span>
            <span className="text-sm font-medium leading-relaxed">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {/* Profile Details */}
        <section className="glass-effect rounded-[2.5rem] p-10 border border-border shadow-2xl">
          <div className="flex items-center gap-3 mb-10 text-foreground font-black text-xl">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-6 h-6" />
            </div>
            Public Profile
          </div>
          
          <div className="grid gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full bg-muted/30 border border-border/40 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email (Auth)</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg text-primary placeholder:text-primary/30" 
                  />
                  <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 pointer-events-none" />
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-2 px-1">Note: Email changes require verification via your inbox.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567" 
                  className="w-full bg-muted/30 border border-border/40 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location / City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lahore" 
                  className="w-full bg-muted/30 border border-border/40 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Business Bio / Description</label>
              <textarea 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Tell the marketplace about your business..." 
                className="w-full bg-muted/30 border border-border/40 rounded-3xl px-6 py-5 min-h-[160px] focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium resize-none shadow-inner" 
              />
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="flex justify-center md:justify-end pt-6">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <Save className="w-6 h-6" />
            )}
            {saving ? 'UPDATING...' : 'SAVE ALL CHANGES'}
          </button>
        </div>
      </div>
    </div>
  )
}

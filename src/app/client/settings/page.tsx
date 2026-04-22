'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ClientSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setEmail(user.email || '')

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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)
      
      if (profileError) throw profileError

      // 2. Update Seller Profile (Upsert in case it doesn't exist)
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

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err: any) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' })
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
        <p className="text-muted-foreground text-lg">Manage your personal information and preferences.</p>
      </header>

      {message && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid gap-8">
        {/* Profile Details */}
        <section className="glass-effect rounded-3xl p-8 border border-border shadow-xl">
          <div className="flex items-center gap-3 mb-8 text-foreground font-bold border-b border-border/40 pb-4">
            <User className="w-5 h-5 text-primary" />
            Profile Details
          </div>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full bg-muted/10 border border-border/20 rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed font-medium" 
                />
                <p className="text-[10px] text-muted-foreground mt-1">Email changes must be requested via support.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567" 
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lahore" 
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Business Name / Bio</label>
              <textarea 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Tell us about yourself or your business..." 
                className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
          </div>
        </section>

        {/* Security Section (Placeholder for UI) */}
        <section className="glass-effect rounded-3xl p-8 border border-border shadow-xl">
          <div className="flex items-center gap-3 mb-8 text-foreground font-bold border-b border-border/40 pb-4">
            <Shield className="w-5 h-5 text-primary" />
            Security & Preferences
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div>
                <p className="text-sm font-bold">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates about your ad status.</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

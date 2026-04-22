import { supabase } from './supabase'

export type UserRole = 'client' | 'moderator' | 'admin' | 'super_admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  status: string
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'zunarajamshad13@gmail.com'

/**
 * Fetches the current user's profile and handles auto-promotion for the Super Admin.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Try to fetch profile
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Auto-promotion logic for the Master Admin
  if (user.email === ADMIN_EMAIL) {
    if (!profile || profile.role !== 'super_admin') {
      console.log(`Auto-promoting ${user.email} to super_admin`)
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          role: 'super_admin',
          status: 'active'
        })
        .select()
        .single()
      
      if (!updateError) profile = updatedProfile
    }
  }

  return profile as UserProfile
}

export async function isAdmin() {
  const profile = await getCurrentProfile()
  return profile?.role === 'admin' || profile?.role === 'super_admin'
}

export async function isModerator() {
  const profile = await getCurrentProfile()
  return profile?.role === 'moderator' || profile?.role === 'admin' || profile?.role === 'super_admin'
}

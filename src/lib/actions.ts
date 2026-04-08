'use server'

import { createClient } from '@supabase/supabase-js'
import { normalizeMediaUrl } from './media'

export async function createAdAction(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials for Server Action')
    return { success: false, error: 'System configuration error' }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const title = formData.get('title') as string
  const categoryId = parseInt(formData.get('categoryId') as string)
  const cityId = parseInt(formData.get('cityId') as string)
  const description = formData.get('description') as string
  const mediaUrl = formData.get('mediaUrl') as string
  const packageId = parseInt(formData.get('packageId') as string) || 1

  // 1. Basic Validation
  if (!title || !categoryId || !cityId || !description) {
    return { success: false, error: 'Please fill in all required fields' }
  }

  try {
    // 2. Normalize Slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7)

    // 3. Create Ad Record
    const { data: ad, error: adError } = await supabase
      .from('ads')
      .insert({
        title,
        slug,
        category_id: categoryId,
        city_id: cityId,
        description,
        package_id: packageId,
        status: 'submitted', // Starts as submitted for moderation
        rank_score: 0
      })
      .select()
      .single()

    if (adError) throw adError

    // 4. Handle Media
    if (mediaUrl) {
      const normalized = normalizeMediaUrl(mediaUrl)
      const { error: mediaError } = await supabase
        .from('ad_media')
        .insert({
          ad_id: ad.id,
          source_type: normalized.source_type,
          original_url: normalized.original_url,
          thumbnail_url: normalized.thumbnail_url,
          validation_status: normalized.validation_status
        })
      
      if (mediaError) console.error('Media insertion error:', mediaError)
    }

    // 5. Create audit log
    await supabase.from('audit_logs').insert({
      action_type: 'ad_created',
      target_type: 'ad',
      target_id: ad.id,
      new_value: { title, status: 'submitted' }
    })

    return { success: true, adId: ad.id }
  } catch (err: unknown) {
    console.error('Ad creation action failed:', err)
    const message = err instanceof Error ? err.message : 'Failed to submit ad'
    return { success: false, error: message }
  }
}

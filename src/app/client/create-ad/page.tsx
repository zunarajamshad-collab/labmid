'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Package as PackageIcon, ImageIcon, TextQuote, AlertCircle } from 'lucide-react'
import { useState, useEffect, useTransition } from 'react'
import { supabase } from '@/lib/supabase'
import { createAdAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'

export default function CreateAdPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [categories, setCategories] = useState<{id: number, name: string}[]>([])
  const [cities, setCities] = useState<{id: number, name: string}[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [selectedPackage, setSelectedPackage] = useState(1) // Premium by default

  useEffect(() => {
    async function fetchData() {
      const [{ data: cats }, { data: cits }] = await Promise.all([
        supabase.from('categories').select('id, name').eq('is_active', true),
        supabase.from('cities').select('id, name').eq('is_active', true)
      ])
      
      if (cats) setCategories(cats)
      if (cits) setCities(cits)

      // Fallback if DB is empty/disconnected
      if (!cats || cats.length === 0) setCategories([{id: 1, name: 'Real Estate'}, {id: 2, name: 'Vehicles'}, {id: 3, name: 'Services'}])
      if (!cits || cits.length === 0) setCities([{id: 1, name: 'New York'}, {id: 2, name: 'San Francisco'}, {id: 3, name: 'Chicago'}])
    }
    fetchData()
  }, [])

  async function handleSubmit(formData: FormData) {
    setError(null)
    formData.append('packageId', selectedPackage.toString())

    startTransition(async () => {
      const result = await createAdAction(formData)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => router.push('/client/dashboard'), 2000)
      } else {
        setError(result.error || 'Failed to submit ad')
      }
    })
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black mb-4">Submission Received!</h1>
        <p className="text-muted-foreground text-lg mb-8">Your ad has been submitted for moderation. You will be notified once it is approved for payment.</p>
        <div className="text-sm font-medium animate-pulse">Redirecting to dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl flex-1">
      <div className="mb-8">
        <Link href="/client/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 w-min whitespace-nowrap">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">Create New Listing</h1>
        <p className="text-muted-foreground text-lg">Draft your ad, select a package, and submit it for moderation.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-6">
          <div className="glass-effect p-8 rounded-3xl border border-border shadow-lg space-y-8">
            
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TextQuote className="w-5 h-5 text-primary" /> Listing Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title <span className="text-destructive">*</span></label>
                  <input name="title" required type="text" placeholder="e.g. 2023 Tesla Model 3" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium mb-1">Category <span className="text-destructive">*</span></label>
                     <select name="categoryId" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm font-medium">
                       <option value="">Select...</option>
                       {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">City <span className="text-destructive">*</span></label>
                     <select name="cityId" required className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm font-medium">
                       <option value="">Select...</option>
                       {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                     </select>
                   </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description <span className="text-destructive">*</span></label>
                  <textarea name="description" required rows={5} placeholder="Describe your offering in detail..." className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none resize-none text-sm font-medium leading-relaxed"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price / Budget</label>
                  <input name="price" type="text" placeholder="$0.00 or Contact" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm font-medium" />
                </div>
              </div>
            </section>

            <hr className="border-border/50" />

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> External Media Strategy
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Paste a public Image URL or a YouTube video link. We automatically extract and normalize thumbnails.</p>
              <div>
                 <label className="block text-sm font-medium mb-1">Media URL</label>
                 <input name="mediaUrl" type="url" placeholder="https://youtube.com/watch?v=... or https://..." className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none mb-2 text-sm font-medium" />
                 <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Supported: YouTube, Unsplash, Public image links.
                 </div>
              </div>
            </section>

          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-effect p-6 rounded-3xl border border-border sticky top-24 shadow-xl">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
               <PackageIcon className="w-5 h-5 text-primary" /> Select Package
             </h2>
             
             <div className="space-y-3 mb-6">
                <label 
                  onClick={() => setSelectedPackage(3)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer relative overflow-hidden transition-all ${selectedPackage === 3 ? 'border-primary bg-primary/5' : 'border-border bg-transparent hover:border-primary/50'}`}
                >
                   <input type="radio" name="pkg" checked={selectedPackage === 3} className="mt-1" readOnly />
                   <div>
                     <div className="font-bold flex items-center justify-between">Premium <span className="text-primary">$89</span></div>
                     <div className="text-xs text-muted-foreground">30 days • Homepage Featured • 3x Rank</div>
                   </div>
                </label>

                <label 
                  onClick={() => setSelectedPackage(2)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === 2 ? 'border-primary bg-primary/5' : 'border-border bg-transparent hover:border-primary/50'}`}
                >
                   <input type="radio" name="pkg" checked={selectedPackage === 2} className="mt-1" readOnly />
                   <div>
                     <div className="font-bold flex items-center justify-between">Standard <span className={selectedPackage === 2 ? 'text-primary' : ''}>$49</span></div>
                     <div className="text-xs text-muted-foreground">15 days • Category Priority • 2x Rank</div>
                   </div>
                </label>

                <label 
                  onClick={() => setSelectedPackage(1)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === 1 ? 'border-primary bg-primary/5' : 'border-border bg-transparent hover:border-primary/50'}`}
                >
                   <input type="radio" name="pkg" checked={selectedPackage === 1} className="mt-1" readOnly />
                   <div>
                     <div className="font-bold flex items-center justify-between">Basic <span className={selectedPackage === 1 ? 'text-primary' : ''}>$19</span></div>
                     <div className="text-xs text-muted-foreground">7 days • Standard Visibility</div>
                   </div>
                </label>
             </div>

             <button 
               type="submit" 
               disabled={isPending}
               className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 text-lg rounded-xl transition-all shadow-md mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {isPending ? 'Submitting...' : 'Submit for Review'}
             </button>
             <button type="button" className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3 text-sm rounded-xl transition-all">
               Save as Draft
             </button>
             
             <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
               By submitting, your ad enters the <strong>Moderator Review</strong> phase. Payment will be required after approval.
             </p>
          </div>
        </aside>

      </form>
    </div>
  )
}

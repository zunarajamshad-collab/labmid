import Image from 'next/image'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

import { MapPin, ShieldAlert, BadgeCheck, Clock, CheckCircle2, Copy } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Mock context for the ad detail since database isn't connected to NextJS route handlers yet
const MOCK_AD = {
  id: '1',
  title: 'Luxury Penthouse with View',
  description: 'A fully furnished premium penthouse located in the heart of the city. Features high-speed internet, floor-to-ceiling windows, and luxury finishes throughout. \n\nPerfect for professionals or small families. Utilities included.',
  price: '$8,500/mo',
  city: 'New York',
  category: 'Real Estate',
  is_featured: true,
  package_name: 'Premium',
  views: 1245,
  published_at: '2026-03-25T10:00:00Z',
  expire_at: '2026-04-25T10:00:00Z',
  seller: {
    name: 'Metropolis Properties',
    joined: 'Jan 2025',
    verified: true,
    ads_count: 5
  },
  media: {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    video_id: 'dQw4w9WgXcQ'
  }
}

export default async function AdDetailPage({ params }: { params: { slug: string } }) {
  const { data: adData, error } = await supabase
    .from('ads')
    .select('*, profiles(full_name, created_at), categories(name), cities(name), packages(name, price, is_featured), ad_media(source_type, original_url)')
    .eq('slug', params.slug)
    .single()

  let ad = MOCK_AD;

  if (adData && !error) {
    // Basic YouTube ID extraction helper
    const extractYoutubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
    };

    const mediaType = adData.ad_media?.[0]?.source_type || 'image';
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30*24*60*60*1000);

    const category = adData.categories?.name || 'Uncategorized';
    let fallbackImg = 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80'; // Default
    
    if (category.toLowerCase().includes('real estate')) fallbackImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
    if (category.toLowerCase().includes('vehicles')) fallbackImg = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';
    if (category.toLowerCase().includes('electronics')) fallbackImg = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80';

    ad = {
      id: adData.id,
      title: adData.title,
      description: adData.description || 'No description available for this listing.',
      price: adData.packages?.price ? `$${adData.packages.price}` : 'Contact',
      city: adData.cities?.name || 'Unknown Location',
      category: category,
      is_featured: adData.packages?.is_featured || false,
      package_name: adData.packages?.name || 'Standard',
      views: 0,
      published_at: adData.publish_at || adData.created_at || now.toISOString(),
      expire_at: adData.expire_at || thirtyDaysLater.toISOString(),
      seller: {
        name: adData.profiles?.full_name || 'Unknown Seller',
        joined: adData.profiles?.created_at ? new Date(adData.profiles.created_at).toLocaleDateString() : 'Unknown Database Entry',
        verified: false,
        ads_count: 1
      },
      media: {
        type: mediaType,
        url: adData.ad_media?.[0]?.original_url || fallbackImg,
        video_id: mediaType === 'youtube' ? extractYoutubeId(adData.ad_media[0].original_url) : 'dQw4w9WgXcQ'
      }
    };
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{ad.category}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main Content: Media and Description */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-effect rounded-3xl overflow-hidden border border-border shadow-xl">
            {ad.media.type === 'youtube' ? (
              <div className="aspect-video relative bg-black">
                 {/* This would be an iframe for youtube playback */}
                 <iframe 
                    className="w-full h-full border-0 absolute top-0 left-0" 
                    src={`https://www.youtube.com/embed/${ad.media.video_id}?autoplay=0`} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                 </iframe>
              </div>
            ) : (
              <div className="aspect-video relative bg-muted flex items-center justify-center">
                 <Image 
                    src={ad.media.url} 
                    alt={ad.title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, 66vw"
                 />
              </div>
            )}
          </div>

          <div className="glass-effect p-8 rounded-3xl border border-border">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
               <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{ad.title}</h1>
               <div className="text-3xl font-black text-primary bg-primary/10 px-4 py-2 rounded-xl">{ad.price}</div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground mb-8 pb-8 border-b border-border/50">
               <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {ad.city}</div>
               <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Posted {new Date(ad.published_at).toLocaleDateString()}</div>
               <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">ID: {ad.id} <button aria-label="Copy ID"><Copy className="w-3 h-3 ml-1 hover:text-foreground" /></button></div>
            </div>

            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mb-8 whitespace-pre-line text-muted-foreground leading-relaxed">
              {ad.description}
            </div>
          </div>
        </div>

        {/* Sidebar: Seller Info, Actions, Packages */}
        <div className="space-y-6">
          <div className="glass-effect p-6 rounded-3xl border border-border sticky top-24 shadow-lg">
            <h3 className="text-lg font-bold mb-4 pb-4 border-b border-border/50">Seller Information</h3>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-secondary to-muted border-2 border-primary flex items-center justify-center text-xl font-bold">
                 {ad.seller.name.charAt(0)}
               </div>
               <div>
                  <div className="font-bold text-lg flex items-center gap-1">
                    {ad.seller.name} 
                    {ad.seller.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>Member since {ad.seller.joined}</span>
                  </div>
               </div>
            </div>

            <button className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold py-3 rounded-xl transition-all shadow-md mb-3 flex items-center justify-center gap-2">
              Contact Seller
            </button>
            <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold py-3 rounded-xl transition-all shadow-sm">
              View All Ads ({ad.seller.ads_count})
            </button>
          </div>

          <div className="glass-effect p-6 rounded-3xl border border-border border-l-4 border-l-primary/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldAlert className="w-24 h-24" />
             </div>
             <h4 className="font-bold mb-2">Ad Flow Insights</h4>
             <ul className="text-sm space-y-2 text-muted-foreground z-10 relative">
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> {ad.package_name} Package <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs ml-auto font-bold">{ad.package_name}</span></li>
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Expires: {new Date(ad.expire_at).toLocaleDateString()}</li>
               <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Views: {ad.views}</li>
             </ul>
             
             <button className="flex items-center justify-center gap-2 text-xs text-destructive hover:underline font-bold mt-6 w-full pt-4 border-t border-border/50">
                <ShieldAlert className="w-4 h-4" /> Report this listing
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

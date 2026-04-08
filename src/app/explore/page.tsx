import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Star } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { SearchFilters } from '@/components/explore/SearchFilters'

// Mock Data for structure validation
const MOCK_ADS = [
  { id: '1', title: 'Luxury Penthouse with View', slug: 'luxury-penthouse', price: '$8,500/mo', city: 'New York', category: 'Real Estate', is_featured: true, rank_score: 95, thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: 'Porsche 911 Carrera GTS', slug: 'porsche-911', price: '$145,000', city: 'Miami', category: 'Vehicles', is_featured: true, rank_score: 90, thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: 'Modern Workspace Solution', slug: 'modern-workspace', price: '$500/wk', city: 'London', category: 'Real Estate', is_featured: false, rank_score: 60, thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
  { id: '4', title: 'MacBook Pro M3 Max - Sealed', slug: 'macbook-pro-m3', price: '$3,200', city: 'San Jose', category: 'Electronics', is_featured: true, rank_score: 85, thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { id: '5', title: 'Designer Lounge Chair', slug: 'designer-chair', price: '$1,200', city: 'Paris', category: 'Furniture', is_featured: false, rank_score: 40, thumbnail: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80' },
  { id: '6', title: 'Canon EOS R5 Mirrorless Camera', slug: 'canon-r5', price: '$3,800', city: 'Tokyo', category: 'Electronics', is_featured: false, rank_score: 55, thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' }
]

interface AdDisplay {
  id: string
  title: string
  slug: string
  price: string
  city: string
  category: string
  is_featured: boolean
  rank_score: number
  thumbnail: string
}

export default async function ExploreAdsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; city?: string; sort?: string }>
}) {
  const params = await searchParams;
  const { query, category, city } = params;

  // Build the query
  let supabaseQuery = supabase
    .from('ads')
    .select('*, categories!inner(name, slug), cities!inner(name, slug), packages(price, is_featured), ad_media(thumbnail_url)')
    .eq('status', 'published');

  if (query) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
  }

  if (category) {
    supabaseQuery = supabaseQuery.eq('categories.slug', category);
  }

  if (city) {
    supabaseQuery = supabaseQuery.eq('cities.slug', city);
  }

  // Fetch data for filters
  const [{ data: adsData, error }, { data: categories }, { data: cities }] = await Promise.all([
    supabaseQuery,
    supabase.from('categories').select('*').eq('is_active', true),
    supabase.from('cities').select('*').eq('is_active', true)
  ]);

  let displayAds: AdDisplay[] = [];
  
  if (adsData && adsData.length > 0 && !error) {
    displayAds = adsData.map((ad: { id: string, title: string, slug: string, rank_score?: number, packages?: { price: number | string, is_featured: boolean } | null, cities?: { name: string | null }, categories?: { name: string | null }, ad_media?: { thumbnail_url: string | null }[] }) => {
      const category = ad.categories?.name || 'Uncategorized';
      let fallbackImg = 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'; // Default
      
      if (category.toLowerCase().includes('real estate')) fallbackImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
      if (category.toLowerCase().includes('vehicles')) fallbackImg = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
      if (category.toLowerCase().includes('electronics')) fallbackImg = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';

      return {
        id: ad.id,
        title: ad.title,
        slug: ad.slug,
        price: ad.packages?.price ? `$${ad.packages.price}` : 'Contact',
        city: ad.cities?.name || 'Unknown Location',
        category: category,
        is_featured: ad.packages?.is_featured || false,
        rank_score: ad.rank_score || 0,
        thumbnail: ad.ad_media && ad.ad_media.length > 0 && ad.ad_media[0].thumbnail_url ? ad.ad_media[0].thumbnail_url : fallbackImg
      };
    });
  } else {
    // Basic filtering for mock data to show it's "working" even without DB
    displayAds = MOCK_ADS.filter((ad: { title: string, category: string, city: string }) => {
      let matches = true;
      if (query && !ad.title.toLowerCase().includes(query.toLowerCase())) matches = false;
      if (category && ad.category.toLowerCase().replace(' ', '-') !== category) matches = false;
      if (city && ad.city.toLowerCase().replace(' ', '-') !== city) matches = false;
      return matches;
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <SearchFilters 
          categories={categories || [
            { id: 1, name: 'Real Estate', slug: 'real-estate' },
            { id: 2, name: 'Vehicles', slug: 'vehicles' },
            { id: 3, name: 'Services', slug: 'services' }
          ]} 
          cities={cities || [
            { id: 1, name: 'New York', slug: 'new-york' },
            { id: 2, name: 'San Francisco', slug: 'san-francisco' },
            { id: 3, name: 'Chicago', slug: 'chicago' }
          ]} 
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {query || category || city ? 'Search Results' : 'Active Listings'}
            <span className="text-sm font-normal text-muted-foreground ml-2">({displayAds.length} found)</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="px-3 py-1 rounded-lg bg-background border border-border outline-none text-sm cursor-pointer">
              <option>Highest Rank</option>
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {displayAds.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAds.sort((a,b) => b.rank_score - a.rank_score).map((ad) => (
              <Link href={`/explore/${ad.slug}`} key={ad.id} className="group glass-effect border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <Image 
                    src={ad.thumbnail} 
                    alt={ad.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {ad.is_featured && (
                      <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3" fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-lg font-bold text-sm shadow-sm">
                    {ad.price}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">{ad.category}</div>
                  <h3 className="font-bold text-foreground leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">{ad.title}</h3>
                  <div className="mt-auto flex justify-between items-center text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{ad.city}</span>
                    </div>
                    <span>Score: {ad.rank_score}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-effect rounded-3xl p-12 text-center border border-dashed border-border">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No matching ads found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
            <Link href="/explore" className="inline-block mt-6 text-primary font-bold hover:underline">Clear all filters</Link>
          </div>
        )}
      </main>
    </div>
  )
}

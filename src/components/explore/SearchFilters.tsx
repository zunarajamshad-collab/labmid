'use client'

import { Search, MapPin, Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface SimpleItem {
  id: number | string;
  name: string;
  slug: string;
}

export function SearchFilters({ categories, cities }: { categories: SimpleItem[], cities: SimpleItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) params.set('query', query)
    else params.delete('query')
    
    if (category) params.set('category', category)
    else params.delete('category')
    
    if (city) params.set('city', city)
    else params.delete('city')

    startTransition(() => {
      router.push(`/explore?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="glass-effect rounded-2xl p-6 border border-border sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-lg font-bold">
        <Filter className="w-5 h-5 text-primary" />
        <h3>Filters</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keywords..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-muted-foreground">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-background border border-border outline-none focus:border-primary text-sm appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-muted-foreground">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border outline-none focus:border-primary text-sm appearance-none cursor-pointer"
            >
              <option value="">All Locations</option>
              {cities.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {isPending ? 'Searching...' : 'Apply Filters'}
        </button>
        
        {(query || category || city) && (
          <button 
            type="button"
            onClick={() => {
              setQuery(''); setCategory(''); setCity('');
              router.push('/explore')
            }}
            className="w-full text-xs text-muted-foreground hover:text-primary transition-colors mt-2"
          >
            Clear All
          </button>
        )}
      </div>
    </form>
  )
}

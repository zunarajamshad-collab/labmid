import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto glass-effect rounded-3xl p-8 md:p-12 border border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
            <p>At AdFlow Pro, we collect your email address and basic profile information to facilitate ad submissions and moderator reviews. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">2. Use of Cookies</h2>
            <p>We use essential cookies to maintain your login session and security. Experience-enhancing cookies may be used for analytics to improve our marketplace performance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">3. Data Security</h2>
            <p>Your listings and account details are stored securely using Supabase. Payment information is handled through verified providers and never stored directly on our servers.</p>
          </section>

          <section>
             <p className="text-sm italic">Last updated: April 8, 2026</p>
          </section>
        </div>
      </div>
    </div>
  )
}

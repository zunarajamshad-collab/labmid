import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto glass-effect rounded-3xl p-8 md:p-12 border border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
        </div>
        
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Listing Moderation</h2>
            <p>All ads submitted to AdFlow Pro are subject to human review. We reserve the right to decline any listing that violates our community standards or contains misleading information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">2. Payment & Refunds</h2>
            <p>Premium packages require upfront payment. Once a listing is approved and published, the payment is non-refundable unless the ad is removed due to a server-side error.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">3. User Responsibility</h2>
            <p>Users are responsible for the accuracy of the contact details provided in their ads. Misuse of the platform may lead to account suspension.</p>
          </section>

          <section>
             <p className="text-sm italic">Last updated: April 8, 2026</p>
          </section>
        </div>
      </div>
    </div>
  )
}

import { HelpCircle } from 'lucide-react'

export default function FAQPage() {
  const faqs = [
    {
      q: "How long does moderation take?",
      a: "Our typical review time is under 24 hours. You will receive an email notification once your ad moves from 'Review' to 'Payment Pending'."
    },
    {
      q: "Can I edit my ad after it's published?",
      a: "Yes, you can edit your ad details from your client dashboard. Significant changes may require a re-review by our moderators."
    },
    {
      q: "What payment methods do you accept?",
      a: "We currently support direct bank transfer verification and are working on credit card integrations via Stripe."
    },
    {
      q: "How do the premium packages work?",
      a: "Premium packages give your ad higher ranking in search results and feature it on the homepage for maximum visibility."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Frequently Asked Questions</h1>
        </div>
        
        <div className="grid gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-effect rounded-3xl p-8 border border-border hover:border-primary/30 transition-colors">
              <h3 className="text-lg font-bold text-foreground mb-3">{faq.q}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

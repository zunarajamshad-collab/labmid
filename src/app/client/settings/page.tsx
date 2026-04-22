import { User, Mail, Shield, Save } from 'lucide-react'

export default function ClientSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your personal information and preferences.</p>
      </header>

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
                <input type="text" placeholder="John Doe" className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <input type="email" placeholder="john@example.com" disabled className="w-full bg-muted/10 border border-border/20 rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Bio / Business Brief</label>
              <textarea placeholder="Tell us about yourself..." className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="glass-effect rounded-3xl p-8 border border-border shadow-xl">
          <div className="flex items-center gap-3 mb-8 text-foreground font-bold border-b border-border/40 pb-4">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </div>
          <div className="space-y-6">
            <button className="text-sm text-primary font-bold hover:underline">Change Password</button>
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="text-sm">Two-Factor Authentication</div>
              <div className="w-10 h-5 bg-muted rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}

import { Settings, Save, Globe, Lock, Bell } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen">
      <div className="flex-1 space-y-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <Settings className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
               <p className="text-muted-foreground">Manage global platform configurations.</p>
             </div>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </header>

        <div className="grid gap-6">
          {/* General Section */}
          <section className="glass-effect rounded-3xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6 text-foreground font-bold border-b border-border/40 pb-4">
              <Globe className="w-5 h-5 text-primary" />
              General Marketplace
            </div>
            <div className="space-y-6">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Marketplace Name</label>
                <input type="text" defaultValue="AdFlow Pro" className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                <input type="email" defaultValue="support@adflow.pro" className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* Moderation Rules */}
          <section className="glass-effect rounded-3xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6 text-foreground font-bold border-b border-border/40 pb-4">
              <Lock className="w-5 h-5 text-primary" />
              Security & Moderation
            </div>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                 <div>
                   <p className="font-bold">Auto-expire Ads</p>
                   <p className="text-sm text-muted-foreground">Automatically hide ads after package duration ends.</p>
                 </div>
                 <div className="w-12 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
               </div>
               <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                 <div>
                   <p className="font-bold">Human Review Required</p>
                   <p className="text-sm text-muted-foreground">All new submissions must be approved by a moderator.</p>
                 </div>
                 <div className="w-12 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
               </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sidebar (Navigation) */}
      <aside className="w-full lg:w-64 space-y-4 flex-shrink-0">
          <div className="glass-effect rounded-2xl border border-border p-4 space-y-2">
             <a href="/admin/dashboard" className="block w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium text-sm">Dashboard</a>
             <a href="/admin/analytics" className="block w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground font-medium text-sm">Analytics</a>
             <a href="/admin/settings" className="block w-full text-left px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold text-sm">System Settings</a>
          </div>
      </aside>
    </div>
  )
}

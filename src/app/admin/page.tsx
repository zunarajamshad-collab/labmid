import { redirect } from 'next/navigation'

export default function AdminRootRedirect() {
  // Redirect /admin to /admin/dashboard
  redirect('/admin/dashboard')
}

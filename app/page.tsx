import { HomeContent } from '@/components/home-content'
import { SiteShell } from '@/components/site-shell'

// Sanity publishes should be visible on the next request without a Vercel redeploy.
export const revalidate = 0

export default function Page() {
  return (
    <SiteShell>
      <HomeContent />
    </SiteShell>
  )
}

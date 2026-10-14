import Link from 'next/link'

export default function StudioPage() {
  return <main className="studio-page"><div className="studio-card"><span className="eyebrow">Private publishing dashboard</span><h1>Sanity<br /><em>Studio</em></h1><p>Connect your Sanity project to publish articles, books, photographs, quotations, and academic achievements without editing code.</p><div className="studio-actions"><a href="https://www.sanity.io/manage" target="_blank" rel="noreferrer">Open Sanity Manage ↗</a><Link href="/">Return to website</Link></div><small>Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_READ_TOKEN in your Vercel project to connect live content.</small></div></main> }


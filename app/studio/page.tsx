'use client'

import dynamic from 'next/dynamic'

const StudioShell = dynamic(
  () => import('../../components/studio-shell').then((module) => module.StudioShell),
  { ssr: false }
)

export const dynamicParams = false

export default function StudioPage() {
  return <StudioShell />
}

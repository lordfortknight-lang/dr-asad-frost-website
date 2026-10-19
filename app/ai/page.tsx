import type { Metadata } from 'next'
import { DrAsadFrostAI } from '@/components/dr-asad-frost-ai'

export const metadata: Metadata = {
  title: 'Dr Asad Frost AI — One intelligent companion',
  description: 'An educational AI companion for dental intelligence, markets, and thoughtful mentorship.',
}

export default function AIPage() {
  return <DrAsadFrostAI />
}

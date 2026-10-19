import type { Metadata } from 'next'
import Link from 'next/link'
import { DrAsadFrostAI } from '@/components/dr-asad-frost-ai'

export const metadata: Metadata = { title: 'Dr Asad Frost AI', description: 'A thoughtful AI companion for dental education, market understanding, and mentorship.' }

export default function AIPage() {
  return <><DrAsadFrostAI /><Link className="ai-home-link" href="/">Return to Dr Asad Frost</Link></>
}

import dynamic from 'next/dynamic'
import config from '../../sanity.config'

const NextStudio = dynamic(
  async () => (await import('next-sanity/studio')).NextStudio,
  { ssr: false }
)

export default function StudioPage() {
  return <NextStudio config={config} />
}

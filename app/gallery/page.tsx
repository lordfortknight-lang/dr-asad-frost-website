import type { Metadata } from "next";
import GalleryExperience from "./GalleryExperience";

export const metadata: Metadata = {
  title: "Gallery | Dr Asad Frost",
  description:
    "A walk through photographs: mountains, moments and life around the clinic.",
  alternates: { canonical: '/gallery' },
  openGraph: {
    type: 'website',
    url: 'https://www.asadfrost.in/gallery',
    title: 'Gallery | Dr Asad Frost',
    description: 'A walk through photographs: mountains, moments and life around the clinic.',
  },
  twitter: {
    card: 'summary',
    title: 'Gallery | Dr Asad Frost',
    description: 'A walk through photographs: mountains, moments and life around the clinic.',
  },
};

export default function GalleryPage() {
  return <GalleryExperience />;
}

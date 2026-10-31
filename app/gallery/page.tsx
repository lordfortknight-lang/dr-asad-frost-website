import type { Metadata } from "next";
import GalleryExperience from "./GalleryExperience";

export const metadata: Metadata = {
  title: "Gallery | Dr Asad Frost",
  description:
    "A walk through photographs: mountains, moments and life around the clinic.",
};

export default function GalleryPage() {
  return <GalleryExperience />;
}

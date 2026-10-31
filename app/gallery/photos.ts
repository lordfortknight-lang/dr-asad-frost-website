// Edit this file to add your real photos.
//
// For every photo you can set  src: "/gallery/1.jpg"
// (put the image in the /public/gallery folder) or use any image URL.
// A photo without `src` shows a placeholder mountain picture.

export type Photo = {
  band: number; // index in BANDS below
  caption: string;
  src?: string;
};

export const BANDS: { name: string; color: string }[] = [
  { name: "Mountains", color: "#762b3b" },
  { name: "Moments", color: "#1d4d40" },
  { name: "Clinic", color: "#9c7a30" },
];

export const PHOTOS: Photo[] = [
  { band: 0, caption: "Above the clouds" },
  { band: 0, caption: "Quiet ridge" },
  { band: 0, caption: "First light" },
  { band: 0, caption: "Snow line" },
  { band: 1, caption: "Conference day" },
  { band: 1, caption: "Golden hour" },
  { band: 1, caption: "Notes in the margin" },
  { band: 2, caption: "Chairside" },
  { band: 2, caption: "Smile work" },
  { band: 2, caption: "Learning every day" },
];

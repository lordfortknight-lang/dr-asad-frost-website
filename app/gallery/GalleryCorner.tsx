import Link from "next/link";
import Art from "./Art";
import s from "./gallery.module.css";

// A small "Gallery" tile for the bottom-right corner. Tapping it opens /gallery.
export default function GalleryCorner() {
  const tilt = [22, 0, -22];
  const left = [6, 44, 82];
  const height = [70, 84, 70];
  return (
    <Link href="/gallery" className={s.tile} aria-label="Open the photo gallery">
      <span className={s.mn}>
        {[0, 2, 4].map((i, k) => (
          <span
            key={i}
            className={s.mini}
            style={{
              left: left[k],
              height: height[k],
              transform: `rotateY(${tilt[k]}deg)`,
            }}
          >
            <Art i={i} alt="" />
          </span>
        ))}
      </span>
      Gallery
      <small>Tap to enter</small>
    </Link>
  );
}

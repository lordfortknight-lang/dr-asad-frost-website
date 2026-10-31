import s from "./gallery.module.css";

const PAL: [string, string][] = [
  ["#f6c28b", "#c9566a"],
  ["#a9d0e0", "#2f5f7a"],
  ["#f3e1b0", "#b8923f"],
  ["#d9c4e8", "#5a3b70"],
  ["#a6d6c4", "#1d4d40"],
  ["#f2b8a0", "#762b3b"],
];

function rnd(i: number, k: number): number {
  return ((i * 97 + k * 57 + 13) % 41) / 41;
}

function poly(i: number, k: number, lo: number, hi: number): string {
  const p: string[] = ["0 100%"];
  for (let j = 0; j <= 5; j++) {
    p.push(`${j * 20}% ${Math.round(lo + rnd(i, k + j) * (hi - lo))}%`);
  }
  p.push("100% 100%");
  return `polygon(${p.join(",")})`;
}

type Props = { i: number; src?: string; alt: string };

// A real photo when `src` is set, otherwise a placeholder mountain picture.
export default function Art({ i, src, alt }: Props) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={s.img} draggable={false} />;
  }
  const c = PAL[i % PAL.length];
  return (
    <div
      className={s.art}
      style={{ background: `linear-gradient(180deg, ${c[0]}, ${c[1]})` }}
      role="img"
      aria-label={alt}
    >
      <b
        style={{
          width: `${20 + rnd(i, 3) * 14}%`,
          aspectRatio: "1",
          left: `${15 + rnd(i, 5) * 55}%`,
          top: `${10 + rnd(i, 7) * 22}%`,
        }}
      />
      <i style={{ background: "#0000004d", clipPath: poly(i, 1, 28, 58) }} />
      <i style={{ background: "#00000085", clipPath: poly(i, 9, 52, 80) }} />
    </div>
  );
}

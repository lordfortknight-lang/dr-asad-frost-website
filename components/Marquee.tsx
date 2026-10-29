import s from "./Marquee.module.css";
const W = ["A mind in pursuit of knowledge, a life in pursuit of meaning."];
export default function Marquee({ words = W, speed = 60 }: { words?: string[]; speed?: number }) {
  const l = [...words, ...words, ...words, ...words];
  return (
    <div className={s.m} aria-hidden="true" style={{ ["--d" as string]: `${speed}s` }}>
      <div className={s.t}>
        {l.map((w, i) => (
          <span key={i} className={s.i}>{w}<i className={s.o} /></span>
        ))}
      </div>
    </div>
  );
}

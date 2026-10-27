type Props = { words?: string[]; speed?: number };

const DEFAULT_WORDS = [
  "Dentistry",
  "Poetry",
  "Literature",
  "Essays",
  "Financial markets",
  "Clinical stories",
  "The art of observation",
  "Read slowly",
  "Think deeply",
];

export default function Marquee({ words = DEFAULT_WORDS, speed = 40 }: Props) {
  const list = [...words, ...words];

  return (
    <div
      className="marquee"
      aria-hidden="true"
      style={{ ["--marquee-duration" as string]: `${speed}s` }}
    >
      <div className="marquee-track">
        {list.map((word, i) => (
          <span key={i} className="marquee-item">
            {word}
            <i className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

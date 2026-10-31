"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import Art from "./Art";
import { BANDS, PHOTOS } from "./photos";
import s from "./gallery.module.css";

const PX = 300; // scroll distance (px) for one photo
const ROW = 230; // row height on the runway, same as .row in gallery.module.css

export default function GalleryExperience() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const scRef = useRef<HTMLDivElement>(null);
  const spRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const [lb, setLb] = useState<number | null>(null);
  const n = PHOTOS.length;

  function update() {
    const sc = scRef.current;
    const root = rootRef.current;
    if (!sc || !root) return;
    const p = Math.max(0, Math.min(1, sc.scrollTop / ((n - 1) * PX)));
    root.style.setProperty("--ty", `${p * (n - 1) * ROW}px`);
    root.style.setProperty("--sw", `${Math.sin(p * 10) * 3}deg`);
    setCur(Math.round(p * (n - 1)));
  }

  // open with the reveal animation, lock the page behind
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const size = () => {
      if (spRef.current) {
        spRef.current.style.height = `${(n - 1) * PX + window.innerHeight}px`;
      }
    };
    size();
    window.addEventListener("resize", size);
    const t = window.setTimeout(() => setOpen(true), 30);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", size);
      document.body.style.overflow = prev;
    };
  }, [n]);

  // keyboard control for the big photo view
  useEffect(() => {
    if (lb === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLb((v) => (v === null ? v : (v - 1 + n) % n));
      if (e.key === "ArrowRight") setLb((v) => (v === null ? v : (v + 1) % n));
      if (e.key === "Escape") setLb(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lb, n]);

  function onScroll() {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      update();
    });
  }

  // the scroll layer is on top, so find the photo under the finger
  function onClick(e: ReactMouseEvent<HTMLDivElement>) {
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    for (const el of els) {
      const hit = el.closest("[data-photo]");
      if (hit instanceof HTMLElement) {
        setLb(Number(hit.dataset.photo));
        return;
      }
    }
  }

  function back() {
    setOpen(false);
    window.setTimeout(() => router.push("/"), 700);
  }

  function jump(band: number) {
    const first = PHOTOS.findIndex((p) => p.band === band);
    scRef.current?.scrollTo({ top: first * PX, behavior: "smooth" });
  }

  const band = PHOTOS[cur].band;

  return (
    <div
      ref={rootRef}
      className={`${s.root} ${open ? s.open : ""}`}
      role="region"
      aria-label="Photo gallery"
    >
      <div className={s.stage}>
        <div className={s.floor}>
          <div className={s.track}>
            {PHOTOS.map((p, i) => {
              const right = i % 2 === 1;
              return (
                <div key={i} className={s.row} style={{ background: BANDS[p.band].color }}>
                  {(i === 0 || PHOTOS[i - 1].band !== p.band) && (
                    <div className={s.ft}>{BANDS[p.band].name}</div>
                  )}
                  <div className={`${s.sh} ${right ? s.r : s.l}`} />
                  <div className={`${s.ph} ${right ? s.pr : s.pl}`} data-photo={i}>
                    <Art i={i} src={p.src} alt={p.caption} />
                    <div className={s.cp}>{p.caption}</div>
                  </div>
                </div>
              );
            })}
            {Array.from({ length: n * 2 }, (_, k) => (
              <span key={`l${k}`}>
                <span className={s.rl} style={{ left: -40, bottom: k * 130 }}>
                  {(k * 500).toLocaleString("en-US")}
                </span>
                <span className={s.rl} style={{ right: -40, bottom: k * 130 }}>
                  {(k * 500).toLocaleString("en-US")}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className={s.fog} />
      </div>

      <div ref={scRef} className={s.sc} onScroll={onScroll} onClick={onClick}>
        <div ref={spRef} />
      </div>

      <div className={`${s.gui} ${s.gt}`}>
        <button type="button" className={`${s.btn} ${s.back}`} onClick={back}>
          Back
        </button>
        <b>Gallery</b>
      </div>
      <nav className={`${s.gui} ${s.gn}`} aria-label="Albums">
        {BANDS.map((b, j) => (
          <button
            key={b.name}
            type="button"
            className={`${s.btn} ${s.nb} ${band === j ? s.on : ""}`}
            onClick={() => jump(j)}
          >
            <i />
            {b.name}
          </button>
        ))}
      </nav>
      <div className={`${s.gui} ${s.gc}`}>
        {String(cur + 1).padStart(2, "0")} / {n}
      </div>
      <div className={`${s.gui} ${s.gh}`}>Scroll to walk. Tap a photo.</div>

      {lb !== null && (
        <div className={s.lb} role="dialog" aria-modal="true" aria-label={PHOTOS[lb].caption}>
          <div key={lb} className={s.la}>
            <Art i={lb} src={PHOTOS[lb].src} alt={PHOTOS[lb].caption} />
          </div>
          <p className={s.lt}>{PHOTOS[lb].caption}</p>
          <div className={s.lr}>
            <button
              type="button"
              className={`${s.btn} ${s.pill}`}
              onClick={() => setLb((lb - 1 + n) % n)}
            >
              Previous
            </button>
            <button
              type="button"
              className={`${s.btn} ${s.pill}`}
              onClick={() => setLb((lb + 1) % n)}
            >
              Next
            </button>
            <button type="button" className={`${s.btn} ${s.pill}`} onClick={() => setLb(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
    }

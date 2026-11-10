'use client'

import { useState } from 'react'

export function CuriousCompanion() {
  const [curious, setCurious] = useState(false)

  return (
    <aside
      className={`curious-companion${curious ? ' is-curious' : ''}`}
      aria-label="A little curious companion"
      onMouseEnter={() => setCurious(true)}
      onMouseLeave={() => setCurious(false)}
    >
      <div className="curious-note">just another curious day...</div>
      <svg className="curious-art" viewBox="0 0 520 390" role="img" aria-labelledby="curious-title">
        <title id="curious-title">A small dinosaur reading a book beside a stack of books</title>
        <defs>
          <pattern id="paper-lines" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 7.5H8" stroke="#b79a61" strokeOpacity=".22" strokeWidth=".6" />
          </pattern>
        </defs>

        {/* hand-drawn ground and soft shadow */}
        <path d="M28 337 C130 327 365 329 489 339" fill="none" stroke="#762b3b" strokeOpacity=".45" strokeWidth="1.4" />
        <ellipse cx="259" cy="337" rx="205" ry="13" fill="#762b3b" opacity=".07" />

        {/* book stack */}
        <g className="companion-books" stroke="#4c2028" strokeWidth="2" strokeLinejoin="round">
          <path d="M57 285 Q145 278 236 287 L231 315 Q143 309 54 316Z" fill="#d5bca2" />
          <path d="M54 316 Q142 309 231 315 L227 322 Q141 316 53 324Z" fill="#b79a61" />
          <path d="M65 251 Q151 245 239 253 L235 282 Q150 276 61 284Z" fill="#f7f1e7" />
          <path d="M61 284 Q150 276 235 282 L231 289 Q146 282 60 291Z" fill="#d5bca2" />
          <path d="M72 219 Q158 213 246 221 L241 248 Q157 242 68 252Z" fill="#eee5d8" />
          <path d="M68 252 Q157 242 241 248 L237 256 Q153 248 67 259Z" fill="#b79a61" />
          <path d="M85 230 Q150 225 220 231" fill="none" stroke="#b79a61" strokeWidth="1" />
          <path d="M78 263 Q151 256 217 263" fill="none" stroke="#b79a61" strokeWidth="1" />
          <path d="M70 297 Q144 291 213 298" fill="none" stroke="#b79a61" strokeWidth="1" />
        </g>
        <g fill="#4c2028" fontFamily="Georgia,serif" fontSize="12" fontStyle="italic">
          <text x="112" y="241">Dentistry</text>
          <text x="117" y="274">Writing</text>
          <text x="116" y="307">Ideas</text>
        </g>

        {/* little dinosaur */}
        <g className="companion-dino" stroke="#4c2028" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M147 213 C125 205 112 186 116 166 C119 146 136 135 155 137 C171 139 180 151 184 165 L207 179 L193 194 L179 188 C170 204 162 211 147 213Z" fill="#d5bca2" />
          <path d="M120 174 C101 175 91 164 87 151 C103 151 115 157 124 166" fill="#d5bca2" />
          <path d="M135 141 L129 124 L145 137 L150 119 L161 139 L172 126 L176 147" fill="#762b3b" />
          <path d="M143 210 L138 232 L151 232 L158 209 M169 202 L174 226 L187 226 L181 191" fill="#d5bca2" />
          <path d="M178 165 Q189 163 194 171" fill="none" />
          <circle cx="165" cy="157" r="3.8" fill="#241c1b" stroke="none" />
          <path d="M183 180 Q190 184 197 179" fill="none" />
          <path d="M133 178 Q145 184 155 177" fill="none" stroke="#b79a61" strokeWidth="1.5" />
        </g>

        {/* open book in dinosaur's hands */}
        <g className="companion-book" stroke="#4c2028" strokeWidth="2" strokeLinejoin="round">
          <path d="M178 173 Q198 164 216 174 L214 203 Q195 194 179 204Z" fill="#f7f1e7" />
          <path d="M216 174 Q235 165 251 174 L248 204 Q230 195 214 203Z" fill="#eee5d8" />
          <path d="M216 174 L214 203" fill="none" />
          <path d="M185 182 Q198 177 207 182 M184 189 Q197 184 207 189 M224 182 Q235 177 244 181 M223 190 Q235 185 243 189" fill="none" stroke="#b79a61" strokeWidth="1" />
        </g>

        {/* small sparkles */}
        <g className="curious-sparkles" fill="none" stroke="#b79a61" strokeWidth="2" strokeLinecap="round">
          <path d="M276 125 V145 M266 135 H286" />
          <path d="M310 158 V170 M304 164 H316" />
          <path d="M255 188 V198 M250 193 H260" />
        </g>

        {/* tiny desk lamp */}
        <g stroke="#4c2028" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M401 328 L414 231 L454 191 L466 202 L427 244 L436 328" />
          <path d="M447 190 L466 166 L496 180 L477 205Z" fill="#b79a61" />
          <path d="M438 328 H489" />
        </g>
        <path d="M465 206 L488 255 L430 255Z" fill="#b79a61" opacity=".12" />
      </svg>
      <div className="curious-caption">
        <span>Curiosity, in good company.</span>
        <span className="curious-dot" aria-hidden="true" />
      </div>

      <style jsx>{`
        .curious-companion {
          position: absolute;
          right: 4.5vw;
          bottom: 7%;
          width: min(43vw, 520px);
          z-index: 0;
          color: var(--burgundy);
          pointer-events: auto;
          cursor: default;
        }
        .curious-note {
          margin: 0 5% 0 auto;
          width: max-content;
          max-width: 90%;
          font: italic clamp(15px, 1.8vw, 22px)/1.2 Georgia, serif;
          color: var(--ink);
          transform: rotate(-5deg);
          transition: transform 350ms ease;
        }
        .curious-art {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
          filter: drop-shadow(0 10px 14px rgba(76,32,40,.06));
        }
        .curious-caption {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin: -3px 4% 0 0;
          color: var(--muted);
          font: 9px Arial, sans-serif;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .curious-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 0 4px rgba(183,154,97,.13);
        }
        .companion-dino {
          transform-box: fill-box;
          transform-origin: 50% 85%;
          animation: dino-breathe 4s ease-in-out infinite;
        }
        .companion-book {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: book-nod 5s ease-in-out infinite;
        }
        .curious-sparkles {
          animation: sparkle 3.5s ease-in-out infinite;
        }
        .curious-companion.is-curious .curious-note {
          transform: rotate(-2deg) translateY(-4px);
        }
        .curious-companion.is-curious .companion-dino {
          animation-duration: 1.5s;
        }
        @keyframes dino-breathe {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-5px) rotate(-1deg); }
        }
        @keyframes book-nod {
          0%, 80%, 100% { transform: rotate(0); }
          88% { transform: rotate(-3deg); }
          94% { transform: rotate(1deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: .45; }
          50% { opacity: 1; }
        }
        @media (max-width: 700px) {
          .curious-companion {
            position: relative;
            right: auto;
            bottom: auto;
            width: min(92%, 430px);
            margin: -1.5rem auto 0;
          }
          .curious-note { font-size: 17px; }
          .curious-caption { font-size: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .companion-dino, .companion-book, .curious-sparkles { animation: none !important; }
          .curious-note { transition: none; }
        }
      `}</style>
    </aside>
  )
}

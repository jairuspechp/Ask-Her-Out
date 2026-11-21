/* bouquet.js: builds the bouquet SVG (240 x 300 art on a 280 x 300 grid) */

function buildBouquetSVG() {

  /* overlapping stems: wide at the top, bunched at the bottom */
  let stemsSVG = "";
  for (let i = 0; i < 10; i++) {
    [140 - 76 + i * 8, 140 + 76 - i * 8].forEach((topX, side) => {
      const endX = side === 0 ? 133 + i * 1.2 : 147 - i * 1.2;   // ends cross near the tip
      const c2 = endX + (topX - 140) * 0.23;
      const d = `M${topX} 128 C${topX} 200 ${c2} 245 ${endX} 300`;
      stemsSVG += `<path d="${d}" stroke="#1d6a37" stroke-width="8"/>` +
                  `<path d="${d}" stroke="#3aa35f" stroke-width="5"/>`;
    });
  }

  return `
  <svg class="bq-art" viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style="stop-color:var(--yes)"/>
        <stop offset="1" style="stop-color:var(--accent)"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff0c4"/>
        <stop offset="1" stop-color="#d9a441"/>
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#1f7a3d"/>
        <stop offset="1" stop-color="#5fd07f"/>
      </linearGradient>

      <!-- the paper outline, reused to clip the stems and the ribbon -->
      <clipPath id="paperClip">
        <path d="M46 85 Q140 113 234 85 L234 125 C234 200 166 245 140 292 C114 245 46 200 46 125 Z"/>
      </clipPath>

      <!-- mini flowers: white and soft gold -->
      <g id="mini">
        <g fill="#fff" stroke="rgba(0,0,0,.15)" stroke-width=".6">
          <circle cx="0" cy="-4.5" r="3.4"/><circle cx="4.3" cy="-1.4" r="3.4"/>
          <circle cx="2.6" cy="3.6" r="3.4"/><circle cx="-2.6" cy="3.6" r="3.4"/>
          <circle cx="-4.3" cy="-1.4" r="3.4"/>
        </g>
        <circle r="2.3" fill="#f5c969"/>
      </g>
      <g id="mini2">
        <g fill="#ffe9b3" stroke="rgba(0,0,0,.15)" stroke-width=".6">
          <circle cx="0" cy="-4.5" r="3.4"/><circle cx="4.3" cy="-1.4" r="3.4"/>
          <circle cx="2.6" cy="3.6" r="3.4"/><circle cx="-2.6" cy="3.6" r="3.4"/>
          <circle cx="-4.3" cy="-1.4" r="3.4"/>
        </g>
        <circle r="2.3" fill="#e08a2c"/>
      </g>
    </defs>

    <!-- thin stems for the mini flowers, pointing up and outward -->
    <g fill="none" stroke="#2f8f4e" stroke-width="2.2" stroke-linecap="round">
      <path d="M104 104 Q44 100 14 46"/>
      <path d="M176 104 Q236 100 266 46"/>
      <path d="M110 84 Q58 56 36 14"/>
      <path d="M170 84 Q222 56 244 14"/>
    </g>

    <!-- leaves -->
    <g fill="url(#leafGrad)" stroke="#14602e" stroke-width="1.2" stroke-linejoin="round">
      <path d="M112 122 Q45 138 8 80 Q75 64 112 122 Z"/>
      <path d="M168 122 Q235 138 272 80 Q205 64 168 122 Z"/>
      <path d="M120 96 Q53 74 62 4 Q129 26 120 96 Z"/>
      <path d="M160 96 Q227 74 218 4 Q151 26 160 96 Z"/>
    </g>
    <g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-linecap="round">
      <path d="M110 122 Q60 104 14 81"/>
      <path d="M170 122 Q220 104 266 81"/>
      <path d="M118 92 Q84 52 63 8"/>
      <path d="M162 92 Q196 52 217 8"/>
    </g>

    <!-- extra leaves filling the gaps (background, behind flowers) -->
    <g fill="url(#leafGrad)" stroke="#14602e" stroke-width="1.2" stroke-linejoin="round">
      <path d="M100 98 Q58 81 34 42 Q76 59 100 98 Z"/>
      <path d="M180 98 Q222 81 246 42 Q204 59 180 98 Z"/>
      <path d="M124 66 Q98 35 90 -4 Q116 27 124 66 Z"/>
      <path d="M156 66 Q182 35 190 -4 Q164 27 156 66 Z"/>
      <path d="M136 60 Q115 26 118 -14 Q139 20 136 60 Z"/>
      <path d="M144 60 Q165 26 162 -14 Q141 20 144 60 Z"/>
    </g>
    <g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.3" stroke-linecap="round">
      <path d="M100 98 Q68 72 36 44"/>
      <path d="M180 98 Q212 72 244 44"/>
      <path d="M124 66 Q102 38 91 -2"/>
      <path d="M156 66 Q178 38 189 -2"/>
      <path d="M136 60 Q121 28 119 -10"/>
      <path d="M144 60 Q159 28 161 -10"/>
    </g>

    <!-- mini flowers: compact clusters, large (1.4) / medium (1.0) / small (0.7) -->
    <!-- left side cluster -->
    <use href="#mini"  transform="translate(14 48) scale(1.4)"/>
    <use href="#mini2" transform="translate(30 52) scale(1.0)"/>
    <use href="#mini2" transform="translate(12 66) scale(1.0)"/>
    <use href="#mini"  transform="translate(26 64) scale(0.7)"/>
    <use href="#mini"  transform="translate(14 84) scale(1.4)"/>
    <use href="#mini2" transform="translate(30 78) scale(0.7)"/>
    <use href="#mini"  transform="translate(36 40) scale(0.7)"/>
    <!-- right side cluster -->
    <use href="#mini2" transform="translate(266 48) scale(1.4)"/>
    <use href="#mini"  transform="translate(250 52) scale(1.0)"/>
    <use href="#mini"  transform="translate(268 66) scale(1.0)"/>
    <use href="#mini2" transform="translate(254 64) scale(0.7)"/>
    <use href="#mini2" transform="translate(266 84) scale(1.4)"/>
    <use href="#mini"  transform="translate(250 78) scale(0.7)"/>
    <use href="#mini2" transform="translate(244 40) scale(0.7)"/>
    <!-- top left cluster -->
    <use href="#mini2" transform="translate(36 14) scale(1.4)"/>
    <use href="#mini"  transform="translate(52 8) scale(1.0)"/>
    <use href="#mini"  transform="translate(24 28) scale(1.0)"/>
    <use href="#mini2" transform="translate(42 30) scale(0.7)"/>
    <use href="#mini2" transform="translate(64 16) scale(0.8)"/>
    <use href="#mini"  transform="translate(70 4) scale(0.7)"/>
    <!-- top right cluster -->
    <use href="#mini"  transform="translate(244 14) scale(1.4)"/>
    <use href="#mini2" transform="translate(228 8) scale(1.0)"/>
    <use href="#mini2" transform="translate(256 28) scale(1.0)"/>
    <use href="#mini"  transform="translate(238 30) scale(0.7)"/>
    <use href="#mini"  transform="translate(216 16) scale(0.8)"/>
    <use href="#mini2" transform="translate(210 4) scale(0.7)"/>

    <!-- extra flowers hugging the photo (mixed sizes: 1.4 / 1.0 / 0.7) -->
    <use href="#mini"  transform="translate(44 74) scale(1.0)"/>
    <use href="#mini2" transform="translate(48 58) scale(0.7)"/>
    <use href="#mini2" transform="translate(52 46) scale(1.4)"/>
    <use href="#mini"  transform="translate(60 34) scale(0.7)"/>
    <use href="#mini"  transform="translate(66 26) scale(1.0)"/>
    <use href="#mini2" transform="translate(76 16) scale(0.7)"/>
    <use href="#mini2" transform="translate(86 9) scale(1.4)"/>
    <use href="#mini"  transform="translate(98 2) scale(0.7)"/>
    <use href="#mini"  transform="translate(108 -2) scale(1.0)"/>
    <use href="#mini2" transform="translate(122 -6) scale(0.7)"/>
    <use href="#mini2" transform="translate(132 -8) scale(1.4)"/>
    <use href="#mini"  transform="translate(148 -8) scale(1.0)"/>
    <use href="#mini2" transform="translate(158 -6) scale(0.7)"/>
    <use href="#mini"  transform="translate(172 -2) scale(1.4)"/>
    <use href="#mini2" transform="translate(182 2) scale(0.7)"/>
    <use href="#mini2" transform="translate(194 9) scale(1.0)"/>
    <use href="#mini"  transform="translate(204 16) scale(0.7)"/>
    <use href="#mini"  transform="translate(214 26) scale(1.4)"/>
    <use href="#mini2" transform="translate(220 34) scale(0.7)"/>
    <use href="#mini2" transform="translate(228 46) scale(1.0)"/>
    <use href="#mini"  transform="translate(232 58) scale(0.7)"/>
    <use href="#mini"  transform="translate(236 74) scale(1.0)"/>

    <!-- main stems: run down to the tip, clipped exactly at the paper's edge -->
    <g clip-path="url(#paperClip)" fill="none" stroke="#2f8f4e" stroke-width="4.5" stroke-linecap="round">
      <path d="M140 150 Q122 215 137 300"/>
      <path d="M140 150 Q158 215 143 300"/>
      <path d="M140 150 L140 300"/>
    </g>

    <!-- stems: thick, overlapping, spread at the top and bunched at the bottom -->
    <g clip-path="url(#paperClip)" fill="none" stroke-linecap="round">
      ${stemsSVG}
    </g>

    <!-- wrapping paper (see-through) -->
    <g opacity=".6">
      <ellipse cx="140" cy="85" rx="94" ry="16" fill="var(--accent)" opacity=".7"/>
      <path d="M46 85 Q140 113 234 85 L234 125 C234 200 166 245 140 292 C114 245 46 200 46 125 Z"
            fill="url(#paperGrad)"/>
      <!-- lighter fold panel -->
      <path d="M62 100 L62 130 C66 190 112 245 140 292 C124 245 116 190 116 130 L116 104 Z" fill="#fff" opacity=".18"/>
      <!-- white pleat lines, all ending at the tip -->
      <g fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.5">
        <path d="M70 106 L70 125 C70 200 120 245 140 292"/>
        <path d="M210 106 L210 125 C210 200 160 245 140 292"/>
        <path d="M93 100 L93 125 C93 200 127 245 140 292"/>
        <path d="M187 100 L187 125 C187 200 153 245 140 292"/>
        <path d="M117 102 L117 125 C117 200 134 245 140 292"/>
        <path d="M163 102 L163 125 C163 200 146 245 140 292"/>
        <path d="M140 108 L140 292"/>
      </g>
      <g fill="#fff" opacity=".55">
        <circle cx="62" cy="110" r="2.5"/><circle cx="218" cy="110" r="2.5"/>
        <circle cx="104" cy="150" r="2.5"/><circle cx="176" cy="150" r="2.5"/>
        <circle cx="116" cy="225" r="2.5"/><circle cx="164" cy="225" r="2.5"/>
        <circle cx="140" cy="262" r="2.5"/>
      </g>
    </g>

    <!-- mini flowers sitting on the paper rim -->
    <use href="#mini"  transform="translate(54 124) scale(.85)"/>
    <use href="#mini2" transform="translate(46 110) scale(.7)"/>
    <use href="#mini2" transform="translate(64 114) scale(.7)"/>
    <use href="#mini2" transform="translate(226 124) scale(.85)"/>
    <use href="#mini"  transform="translate(234 110) scale(.7)"/>
    <use href="#mini"  transform="translate(216 114) scale(.7)"/>

    <!-- gold ribbon: clipped so its ends match the paper's edge exactly -->
    <path clip-path="url(#paperClip)"
          d="M10 196 Q140 218 270 196 L270 212 Q140 234 10 212 Z" fill="url(#goldGrad)"/>

    <!-- bow -->
    <g transform="translate(20 2)">
      <path d="M116 214 Q104 242 88 258 L101 260 Q113 246 122 216Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1"/>
      <path d="M124 214 Q136 242 152 258 L139 260 Q127 246 118 216Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1"/>
      <path d="M120 207 C90 176 74 212 99 222 C108 226 116 217 120 207Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1.5"/>
      <path d="M120 207 C150 176 166 212 141 222 C132 226 124 217 120 207Z" fill="url(#goldGrad)" stroke="#b9852a" stroke-width="1.5"/>
      <circle cx="120" cy="208" r="7" fill="#d9a441" stroke="#b9852a" stroke-width="1.5"/>
    </g>
  </svg>`;
}
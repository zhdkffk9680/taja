// 타자노트 마스코트 "타닥이" — 글쇠(키캡) 모양. 자체 제작 SVG. mood: idle · happy · sad · type(치는 중)
export const MASCOT_COLOR = "#8f6420";
export function mascot(mood = "idle", size = 40) {
  const eyes = mood === "happy"
    ? `<path d="M30 46q7-8 14 0M56 46q7-8 14 0" stroke="#3a2a10" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : mood === "sad"
    ? `<circle cx="37" cy="48" r="5" fill="#3a2a10"/><circle cx="63" cy="48" r="5" fill="#3a2a10"/><path d="M29 39l12 4M71 39l-12 4" stroke="#3a2a10" stroke-width="3.5" stroke-linecap="round"/>`
    : `<circle cx="37" cy="47" r="5.5" fill="#3a2a10"/><circle cx="63" cy="47" r="5.5" fill="#3a2a10"/><circle cx="39" cy="45" r="1.8" fill="#fff"/><circle cx="65" cy="45" r="1.8" fill="#fff"/>`;
  const mouth = mood === "happy"
    ? `<path d="M40 60q10 11 20 0z" fill="#3a2a10"/>`
    : mood === "sad"
    ? `<path d="M41 65q9-7 18 0" stroke="#3a2a10" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : mood === "type"
    ? `<ellipse cx="50" cy="62" rx="6" ry="4.5" fill="#3a2a10"/>`
    : `<path d="M42 60q8 6 16 0" stroke="#3a2a10" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const hands = mood === "type"
    ? `<ellipse cx="24" cy="84" rx="9" ry="5" fill="#e0c48a"/><ellipse cx="76" cy="84" rx="9" ry="5" fill="#e0c48a"/>`
    : `<ellipse cx="22" cy="72" rx="8" ry="5" fill="#e0c48a"/><ellipse cx="78" cy="72" rx="8" ry="5" fill="#e0c48a"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
  <rect x="14" y="20" width="72" height="66" rx="16" fill="#6e4b14"/>
  <rect x="14" y="14" width="72" height="64" rx="16" fill="${MASCOT_COLOR}"/>
  <rect x="22" y="22" width="56" height="46" rx="11" fill="#fff8ea"/>
  <circle cx="30" cy="57" r="4.5" fill="#f0b4a0" opacity=".8"/><circle cx="70" cy="57" r="4.5" fill="#f0b4a0" opacity=".8"/>
  ${eyes}${mouth}${hands}
</svg>`;
}

// 기록 — 이 기기의 localStorage 에만. {runs:[{d,mode,cpm,acc,strokes,secs}], weak:{code:n}, days:{date:strokes}}
const KEY = "taja:rec";
export const MODES = { position: "자리 연습", words: "낱말 연습", short: "짧은 글", long: "긴 글 필사", english: "영어" };

export const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function load() {
  try { const r = JSON.parse(localStorage.getItem(KEY) || "null"); if (r && r.runs) return r; } catch {}
  return { runs: [], weak: {}, days: {} };
}
export function save(r) { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} }

/** 한 판 끝: 기록을 쌓고 {best:이전 최고, isBest} 를 돌려준다 */
export function addRun({ mode, cpm, acc, strokes, secs, errors = {} }) {
  const r = load(), d = todayStr();
  const prev = r.runs.filter((x) => x.mode === mode).reduce((m, x) => Math.max(m, x.cpm), 0);
  r.runs.push({ d, mode, cpm, acc, strokes, secs });
  if (r.runs.length > 300) r.runs = r.runs.slice(-300);
  for (const [code, n] of Object.entries(errors)) r.weak[code] = (r.weak[code] || 0) + n;
  r.days[d] = (r.days[d] || 0) + strokes;
  save(r);
  return { best: prev, isBest: cpm > prev };
}

export const bestOf = (r, mode) => r.runs.filter((x) => x.mode === mode).reduce((m, x) => Math.max(m, x.cpm), 0);

/** 오늘까지 며칠 연속 연습했나 */
export function streak(r, today = todayStr()) {
  let n = 0; const d = new Date(today);
  while (r.days[todayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/** 오타가 잦은 글쇠 순서 [ [code, n], ... ] */
export const weakKeys = (r, k = 5) => Object.entries(r.weak).sort((a, b) => b[1] - a[1]).slice(0, k);

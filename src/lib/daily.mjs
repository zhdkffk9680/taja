// 오늘의 필사 — 날짜로 글을 고른다(서버 없이 모두 같은 글). 짧은 글 묶음과 긴 글을 번갈아 낸다.
import { todayStr } from "./record.mjs";

export function dayHash(s = todayStr()) {
  let h = 2166136261;
  for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}
/** texts: 긴 글 배열 → 오늘 글 */
export function todaysText(texts, date = todayStr()) { return texts[dayHash(date) % texts.length]; }

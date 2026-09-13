// 한글 2벌식 자판 계산기 — 글자를 글쇠(키) 단위로 풀어 타수를 세고, 어느 글쇠를 어느 손가락으로 치는지 안다.
// 타수 규칙: 글쇠 한 번 = 1타. 쌍자음(ㄲㄸㅃㅆㅉ)·ㅒ·ㅖ 는 Shift 와 함께 한 번에 치므로 1타, 겹모음(ㅘ=ㅗ+ㅏ)·겹받침(ㄳ=ㄱ+ㅅ)은 2타.
// 띄어쓰기·문장부호·영문·숫자는 1타.

export const CHO = [..."ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"];
export const JUNG = [..."ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"];
export const JONG = [" ", ..."ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"];

const SPLIT = { "ㅘ": "ㅗㅏ", "ㅙ": "ㅗㅐ", "ㅚ": "ㅗㅣ", "ㅝ": "ㅜㅓ", "ㅞ": "ㅜㅔ", "ㅟ": "ㅜㅣ", "ㅢ": "ㅡㅣ",
  "ㄳ": "ㄱㅅ", "ㄵ": "ㄴㅈ", "ㄶ": "ㄴㅎ", "ㄺ": "ㄹㄱ", "ㄻ": "ㄹㅁ", "ㄼ": "ㄹㅂ", "ㄽ": "ㄹㅅ", "ㄾ": "ㄹㅌ", "ㄿ": "ㄹㅍ", "ㅀ": "ㄹㅎ", "ㅄ": "ㅂㅅ" };

// 물리 글쇠(KeyboardEvent.code) ↔ 자모. 2벌식 표준 배열.
export const KEY_JAMO = {
  KeyQ: "ㅂ", KeyW: "ㅈ", KeyE: "ㄷ", KeyR: "ㄱ", KeyT: "ㅅ", KeyY: "ㅛ", KeyU: "ㅕ", KeyI: "ㅑ", KeyO: "ㅐ", KeyP: "ㅔ",
  KeyA: "ㅁ", KeyS: "ㄴ", KeyD: "ㅇ", KeyF: "ㄹ", KeyG: "ㅎ", KeyH: "ㅗ", KeyJ: "ㅓ", KeyK: "ㅏ", KeyL: "ㅣ",
  KeyZ: "ㅋ", KeyX: "ㅌ", KeyC: "ㅊ", KeyV: "ㅍ", KeyB: "ㅠ", KeyN: "ㅜ", KeyM: "ㅡ",
};
export const SHIFT_JAMO = { KeyQ: "ㅃ", KeyW: "ㅉ", KeyE: "ㄸ", KeyR: "ㄲ", KeyT: "ㅆ", KeyO: "ㅒ", KeyP: "ㅖ" };
export const JAMO_KEY = {};
for (const [k, j] of Object.entries(KEY_JAMO)) JAMO_KEY[j] = { code: k, shift: false };
for (const [k, j] of Object.entries(SHIFT_JAMO)) JAMO_KEY[j] = { code: k, shift: true };

// 손가락: 왼손 새끼(L5)~검지(L2), 오른손 검지(R2)~새끼(R5), 엄지(T)
export const FINGER = {
  KeyQ: "L5", KeyA: "L5", KeyZ: "L5", Digit1: "L5",
  KeyW: "L4", KeyS: "L4", KeyX: "L4", Digit2: "L4",
  KeyE: "L3", KeyD: "L3", KeyC: "L3", Digit3: "L3",
  KeyR: "L2", KeyF: "L2", KeyV: "L2", KeyT: "L2", KeyG: "L2", KeyB: "L2", Digit4: "L2", Digit5: "L2",
  KeyY: "R2", KeyH: "R2", KeyN: "R2", KeyU: "R2", KeyJ: "R2", KeyM: "R2", Digit6: "R2", Digit7: "R2",
  KeyI: "R3", KeyK: "R3", Comma: "R3", Digit8: "R3",
  KeyO: "R4", KeyL: "R4", Period: "R4", Digit9: "R4",
  KeyP: "R5", Semicolon: "R5", Slash: "R5", Digit0: "R5", BracketLeft: "R5", BracketRight: "R5", Quote: "R5", Minus: "R5", Equal: "R5",
  Space: "T",
};
export const FINGER_NAME = { L5: "왼손 새끼", L4: "왼손 약지", L3: "왼손 중지", L2: "왼손 검지", R2: "오른손 검지", R3: "오른손 중지", R4: "오른손 약지", R5: "오른손 새끼", T: "엄지" };

export const isHangul = (ch) => ch >= "가" && ch <= "힣";
export const isJamo = (ch) => ch >= "ㄱ" && ch <= "ㅣ";

/** 완성 글자 → [초성, 중성, 종성|null] (호환 자모) */
export function split(ch) {
  const c = ch.charCodeAt(0) - 0xac00;
  return [CHO[Math.floor(c / 588)], JUNG[Math.floor((c % 588) / 28)], c % 28 ? JONG[c % 28] : null];
}

/** 글자 하나를 치는 글쇠 자모 나열. 겹모음·겹받침은 두 자모로 풀린다. 한글이 아니면 그 문자 그대로 1개. */
export function keysOf(ch) {
  if (isHangul(ch)) return split(ch).filter(Boolean).flatMap((j) => [...(SPLIT[j] ?? j)]);
  if (isJamo(ch)) return [...(SPLIT[ch] ?? ch)];
  return [ch];
}

/** 문자열의 총 타수 */
export const strokes = (text) => [...text].reduce((n, ch) => n + keysOf(ch).length, 0);

/** 글쇠 자모(또는 문자) → 물리 글쇠 코드. 영문자는 대소문자 무관 Key?, 숫자 Digit?, 공백 Space. */
export function codeOf(j) {
  if (JAMO_KEY[j]) return JAMO_KEY[j].code;
  if (/^[a-z]$/i.test(j)) return "Key" + j.toUpperCase();
  if (/^[0-9]$/.test(j)) return "Digit" + j;
  if (j === " ") return "Space";
  return { ",": "Comma", ".": "Period", ";": "Semicolon", "/": "Slash", "'": "Quote", "-": "Minus", "=": "Equal", "?": "Slash", "!": "Digit1", "[": "BracketLeft", "]": "BracketRight" }[j] ?? null;
}

/** 자모 나열 a 가 b 의 앞부분인가(조합 중인 글자 판정용): "하" 는 "한" 의 앞부분 */
export function isPrefixOf(ch, target) {
  if (!ch || !target) return false;
  const a = keysOf(ch), b = keysOf(target);
  return a.length <= b.length && a.every((k, i) => k === b[i]);
}

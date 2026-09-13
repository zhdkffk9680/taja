// 화면 자판(2벌식). 다음에 칠 글쇠·손가락을 비추거나, 기록 페이지에서 오타 열지도(heatmap)를 그린다.
import { KEY_JAMO, SHIFT_JAMO, FINGER, FINGER_NAME } from "./hangul.mjs";

const ROWS = [
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon"],
  ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period"],
  ["Space"],
];
const EN = { Semicolon: ";", Comma: ",", Period: ".", ShiftLeft: "⇧", Space: "" };

/** el 안에 자판을 그린다. opts.lang: "ko"|"en", opts.heat: {code: 0~1} 오타 비율 */
export function renderKeyboard(el, { lang = "ko", heat = null } = {}) {
  el.innerHTML = ROWS.map((row, r) => `<div class="krow r${r}">` + row.map((code) => {
    const ko = KEY_JAMO[code], sh = SHIFT_JAMO[code];
    const label = lang === "ko" && ko ? `<b>${ko}</b>${sh ? `<small>${sh}</small>` : ""}` : `<b>${EN[code] ?? code.replace("Key", "")}</b>`;
    const f = FINGER[code] ?? (code === "ShiftLeft" ? "L5" : "");
    const h = heat && heat[code] ? ` style="--heat:${heat[code].toFixed(2)}"` : "";
    return `<div class="key ${code === "Space" ? "space" : ""} ${code === "ShiftLeft" ? "mod" : ""} f-${f}" data-code="${code}"${h}>${label}</div>`;
  }).join("") + "</div>").join("");
}

/** 다음 글쇠 비추기. shift 면 왼쪽 Shift 도 같이. */
export function highlight(el, code, shift = false) {
  for (const k of el.querySelectorAll(".key.next")) k.classList.remove("next");
  if (!code) return;
  el.querySelector(`.key[data-code="${code}"]`)?.classList.add("next");
  if (shift) el.querySelector(`.key[data-code="ShiftLeft"]`)?.classList.add("next");
}

/** 눌린 효과 */
export function press(el, code, ok = true) {
  const k = el.querySelector(`.key[data-code="${code}"]`);
  if (!k) return;
  k.classList.remove("hit", "miss"); void k.offsetWidth; k.classList.add(ok ? "hit" : "miss");
}

export const fingerName = (code) => FINGER_NAME[FINGER[code]] ?? "";

export const KEYBOARD_CSS = `
.kb{display:grid;gap:5px;user-select:none;-webkit-user-select:none;margin:14px 0}
.krow{display:flex;gap:5px;justify-content:center}
.krow.r1{padding-left:5%}.krow.r2{padding-right:0}
.key{position:relative;flex:1 1 0;max-width:52px;height:46px;border-radius:8px;background:#fff;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:var(--sub);transition:background .1s,transform .08s,border-color .1s}
.key.space{max-width:300px;flex:0 0 52%}
.key.mod{max-width:78px;flex:0 0 12%;font-size:14px}
.key b{font-weight:600}.key small{position:absolute;top:3px;right:6px;font-size:10px;color:var(--mut);font-weight:600}
.key::after{content:"";position:absolute;left:6px;right:6px;bottom:4px;height:3px;border-radius:2px;background:var(--fc,transparent);opacity:.8}
.key.f-L5,.key.f-R5{--fc:#c9a07a}.key.f-L4,.key.f-R4{--fc:#9bb7a2}.key.f-L3,.key.f-R3{--fc:#d9a84a}.key.f-L2,.key.f-R2{--fc:#b06a6a}.key.f-T{--fc:#b8b1a6}
.key.next{background:var(--ink);color:#fff;border-color:var(--ink);transform:translateY(-2px)}
.key.next small{color:#ddd}
.key.hit{animation:key-hit .18s}
.key.miss{background:var(--accent-bg);border-color:var(--danger);color:var(--danger);animation:ui-shake .3s}
@keyframes key-hit{0%{transform:translateY(2px);background:var(--soft)}100%{transform:none}}
.key[style*="--heat"]{background:color-mix(in srgb,#c8451f calc(var(--heat)*80%),#fff);border-color:transparent;color:var(--ink)}
.kb-legend{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;font-size:12px;color:var(--mut);margin:-4px 0 8px}
.kb-legend i{display:inline-block;width:14px;height:5px;border-radius:2px;vertical-align:middle;margin-right:5px}
@media (max-width:480px){.key{height:40px;font-size:13px;border-radius:6px}.key small{display:none}}
`;

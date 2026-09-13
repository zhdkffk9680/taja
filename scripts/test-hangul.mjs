import assert from "node:assert/strict";
import { keysOf, strokes, split, isPrefixOf, codeOf, JAMO_KEY } from "../src/lib/hangul.mjs";

assert.deepEqual(split("한"), ["ㅎ", "ㅏ", "ㄴ"]);
assert.deepEqual(split("가"), ["ㄱ", "ㅏ", null]);
assert.deepEqual(keysOf("한"), ["ㅎ", "ㅏ", "ㄴ"]);
assert.deepEqual(keysOf("왜"), ["ㅇ", "ㅗ", "ㅐ"]);          // 겹모음 2타
assert.deepEqual(keysOf("닭"), ["ㄷ", "ㅏ", "ㄹ", "ㄱ"]);    // 겹받침 2타
assert.deepEqual(keysOf("빵"), ["ㅃ", "ㅏ", "ㅇ"]);          // 쌍자음 1타
assert.deepEqual(keysOf("ㅘ"), ["ㅗ", "ㅏ"]);
assert.deepEqual(keysOf("a"), ["a"]);
assert.equal(strokes("한글 타자"), 3 + 3 + 1 + 2 + 2);       // 한(3) 글(3) 공백(1) 타(2) 자(2) = 11
assert.equal(strokes("The quick"), 9);
assert.equal(isPrefixOf("하", "한"), true);
assert.equal(isPrefixOf("ㅎ", "한"), true);
assert.equal(isPrefixOf("함", "한"), false);
assert.equal(isPrefixOf("한", "한"), true);
assert.equal(codeOf("ㅎ"), "KeyG");
assert.equal(codeOf("ㅃ"), "KeyQ"); assert.equal(JAMO_KEY["ㅃ"].shift, true);
assert.equal(codeOf("q"), "KeyQ"); assert.equal(codeOf(" "), "Space"); assert.equal(codeOf("7"), "Digit7");
console.log("hangul ok");

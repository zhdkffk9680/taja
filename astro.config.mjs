import { defineConfig } from "astro/config";

// 타자노트 — 웹 전용(PC 키보드가 필요해 토스 미니앱은 내지 않는다. 09-14 사냥 3차 결정).
export default defineConfig({
  site: "https://tajayeonseup.pages.dev",
  output: "static",
  trailingSlash: "never",
  build: { inlineStylesheets: "always", format: "file" },
  compressHTML: true,
});

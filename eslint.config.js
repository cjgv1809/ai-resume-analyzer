import { globalIgnores } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/node_modules/**", "public/pdf.worker.min.mjs"]),

  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,

  {
    name: "app/rule-overrides",
    rules: {
      // Route-level pages (views/*.vue) are never used as <Home/>-style tags,
      // and Navbar/Accordion don't collide with any native HTML element —
      // unlike Details/Summary did, which is why those got renamed instead.
      "vue/multi-word-component-names": [
        "error",
        { ignores: ["Navbar", "Accordion", "Home", "Auth", "Upload", "Resume", "Wipe"] },
      ],
      // TS optional prop types (`prop?: string`) already document that the
      // value may be undefined, so a runtime default isn't required too.
      "vue/require-default-prop": "off",
    },
  },

  // Turns off any stylistic rule that Prettier already owns, so the two
  // tools never disagree. Must stay last.
  skipFormatting,
);

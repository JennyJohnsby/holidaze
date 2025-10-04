import js from "@eslint/js";
import globals from "globals";
import { globalIgnores } from "eslint/config";

/** @type {import('eslint').Linter.Config[]} */
export default [
  globalIgnores(["dist"]),
  {
    languageOptions: {
      globals: { ...globals.browser, __dirname: "readonly" },
    },
  },
  js.configs.recommended,
];

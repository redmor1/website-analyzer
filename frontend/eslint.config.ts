import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    // Restrict JSX A11y rules to these file extensions
    files: ["**/*.{jsx,tsx,astro}"],
    ...jsxA11y.flatConfigs.recommended,
  },
  reactHooks.configs.flat.recommended,
]);

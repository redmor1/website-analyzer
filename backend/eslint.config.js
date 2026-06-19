// @ts-check
import node from "eslint-plugin-n"
import { defineConfig } from "eslint/config"
import eslint from "@eslint/js"
import tseslint, { parser } from "typescript-eslint"
import perfectionist from "eslint-plugin-perfectionist"
import sonarjs from "eslint-plugin-sonarjs"
import promise from "eslint-plugin-promise"
import unicorn from "eslint-plugin-unicorn"

export default defineConfig(
  {
    ignores: ["**/*.js"],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  node.configs["flat/recommended-module"],
  perfectionist.configs["recommended-natural"],
  promise.configs["flat/recommended"],
  unicorn.configs["recommended"],
  {
    plugins: {
      sonarjs,
    },
    rules: {
      "sonarjs/cognitive-complexity": "error",
      "sonarjs/no-identical-expressions": "error",
    },
  },
  // override specific rules for node plugin
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "**/tests/**/*"],
    rules: {
      "n/no-unpublished-import": "off",
    },
  },
)

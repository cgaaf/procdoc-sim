import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

export default ts.config(
  // Ignore all JS/TS files (oxlint handles those) and generated code
  {
    ignores: ["**/*.ts", "**/*.js", "**/*.mjs", "**/*.cjs", ".svelte-kit/**"],
  },

  // Svelte recommended rules
  ...svelte.configs["flat/recommended"],

  // Svelte file configuration
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        svelteConfig: import("./svelte.config.js"),
      },
    },
    // Suppress unused-disable-directive warnings for rules not loaded here
    // (e.g. oxlint or typescript-eslint rules disabled inline in .svelte files)
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    rules: {
      // --- Svelte-specific rules ---
      "svelte/require-each-key": "warn",
      "svelte/valid-each-key": "error",
      "svelte/no-at-html-tags": "warn",
      "svelte/no-at-debug-tags": "warn",
      "svelte/no-dom-manipulating": "warn",
      "svelte/no-object-in-text-mustaches": "error",
      "svelte/no-target-blank": "warn",
      "svelte/no-navigation-without-resolve": "off", // noisy without base path

      // --- Disable JS/TS rules that oxlint owns ---
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-inner-declarations": "off",
    },
  },
);

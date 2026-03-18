import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/rgba\\(212,175,55/]",
          message: "Use gold() from @/lib/tokens instead of raw rgba(212,175,55,...)"
        },
        {
          selector: "Literal[value=/rgba\\(255,255,255/]",
          message: "Use white() from @/lib/tokens instead of raw rgba(255,255,255,...)"
        },
        {
          selector: "Literal[value=/rgba\\(220,38,38/]",
          message: "Use red() from @/lib/tokens instead of raw rgba(220,38,38,...)"
        },
        {
          selector: "Literal[value=/rgba\\(60,179,113/]",
          message: "Use green() from @/lib/tokens instead of raw rgba(60,179,113,...)"
        },
      ],
    },
  },
);

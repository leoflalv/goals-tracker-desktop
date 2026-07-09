import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
  { ignores: ["dist", "coverage", "src-tauri"] },

  {
    files: ["**/*.{ts,tsx}"],
    extends: [...tseslint.configs.recommended],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",

      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Section 1: React first, then other external libraries
            ["^react", "^@?\\w"],
            // Section 2: Global/absolute imports via @ alias
            ["^@/"],
            // Section 3: Relative imports
            ["^\\."],
            // Section 4: CSS, assets, and other side-effect imports
            [
              "^.+\\.(css|scss|sass|less|svg|png|jpg|jpeg|gif|webp)$",
              "^\\..*\\.(css|scss|sass|less|svg|png|jpg|jpeg|gif|webp)$",
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
);

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      prettier,
      {
            files: ["**/*.ts"],
            languageOptions: {
                  parserOptions: {
                        project: "./tsconfig.json",
                        tsconfigRootDir: __dirname
                  }
            },
            rules: {
                  "no-console": "error",
                  "no-useless-catch": "off",
                  "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
                  semi: ["error", "always"],
                  quotes: ["error", "double", { allowTemplateLiterals: true }]
            }
      }
];


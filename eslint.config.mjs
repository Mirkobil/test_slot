import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.ts"] },
  { ignores: ["node_modules/*", "dest/**/*", "**/*.js", "eslint.config.mjs", "webpack.config.*"] },
  { languageOptions: { 
    globals: globals.browser, 
    parser: tseslint.parser,
    parserOptions: {
      project: "./tsconfig.json",
    },
    
  } },
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "args": "none",
        }
      ],
      "prefer-const": "warn",
      "@stylistic/semi": ["error", "always"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        {
          ignoreArrowShorthand: true,
        },
      ]
    },
  },
];
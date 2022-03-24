module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
  ],
  plugins: [
    "@typescript-eslint", 
    "import",
  ],
  rules: {
    "indent": ["error", 4],
    "object-curly-spacing": ["error", "always"],
    "quotes": ["warn", "double", { "allowTemplateLiterals": true, "avoidEscape": true }],
    "import/no-unresolved": 0,
    "semi": ["error", "never"],
    "max-len": ["error", { code: 120 }],
    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": false,
        "MethodDefinition": false,
        "ClassDeclaration": false,
        "ArrowFunctionExpression": false,
        "FunctionExpression": false,
      }
    }]
  },
}

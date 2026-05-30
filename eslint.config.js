// @eslint/js recommended + Node globals + eslint-plugin-jest
// Rationale: minimal-friction defaults, CommonJS-aware, catches Jest anti-patterns
const js = require("@eslint/js");
const globals = require("globals");
const jest = require("eslint-plugin-jest");

module.exports = [
  // 1. Inherit ESLint recommended rules
  js.configs.recommended,

  // 2. Project-wide config
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,  // Enables node globals (module, require, console, process, etc.)
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^(req|res|next)$" }],
      "no-console": "off", // Allowed for server startup logs
      "eqeqeq": "error",   // Enforce === and !==
      "curly": "error"     // Enforce curly braces for control flow statements
    }
  },

  // 3. Test-specific configuration — jest plugin + jest globals
  {
    files: ["tests/**/*.js", "__tests__/**/*.js"],
    plugins: { jest },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,  // Enables Jest testing globals (describe, test, expect, beforeAll, etc.)
      }
    },
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/no-disabled-tests": "error",   // Forbid xdescribe / xtest / .skip
      "jest/no-focused-tests": "error",    // Forbid fdescribe / ftest / .only
      "jest/expect-expect": "error"        // Every test must contain at least one assertion
    }
  },

  // 4. Ignore build, coverage, and dependency folders
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "dist/"
    ]
  }
];

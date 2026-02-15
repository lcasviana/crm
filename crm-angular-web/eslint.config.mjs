import { defineConfig } from "eslint/config";

import javascript from "@eslint/js";
import angular from "angular-eslint";
import typescript from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", ".angular/"] },
  {
    files: ["**/*.ts"],
    extends: [javascript.configs.recommended, ...typescript.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: { "@angular-eslint/prefer-on-push-component-change-detection": "error" },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);

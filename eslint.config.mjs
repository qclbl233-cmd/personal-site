import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // 该规则对「effect 中初始化数据/取数」等标准写法误报过多，降级为警告（保留提示，不阻塞 CI）
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;

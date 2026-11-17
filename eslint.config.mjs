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
    // Third-party React Bits components installed verbatim from the shadcn
    // registry. They rely on imperative GSAP/rAF/ref patterns that the React
    // compiler lint rules flag by design; they are not authored in-house.
    "src/components/AnimatedContent.jsx",
    "src/components/PixelSwap.jsx",
    "src/components/GlareHover.jsx",
  ]),
]);

export default eslintConfig;

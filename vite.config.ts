/// <reference types="vitest/config" />

import babel from "@rolldown/plugin-babel";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isCheckDisabled = mode === "production" || !!process.env.VITEST;

  return {
    plugins: [
      devtools(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      tanstackRouter({ autoCodeSplitting: true }),
      react(),
      ...(!isCheckDisabled
        ? [
            checker({
              typescript: true,
            }),
          ]
        : []),
      tsconfigPaths(),
    ],
    server: {
      port: 3000,
      open: true,
    },
    test: {
      coverage: {
        provider: "v8",
        include: ["src/lib/utils/**/*.{ts,tsx,js,jsx}"],
      },
    },
  };
});

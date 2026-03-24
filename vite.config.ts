/// <reference types="vitest/config" />

import babel from "@rolldown/plugin-babel";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

const getChunkGroupName = (moduleId: string): string | null => {
  if (!moduleId.includes("node_modules")) return null;
  if (moduleId.includes("@chakra-ui") || moduleId.includes("@emotion/"))
    return "chakra";
  if (moduleId.includes("@tanstack/")) return "tanstack";
  if (moduleId.includes("react-icons")) return "icons";
  if (moduleId.includes("/sudoku/")) return "sudoku";
  if (moduleId.includes("/react/") || moduleId.includes("/scheduler/"))
    return "react-vendor";
  return "vendor";
};

export default defineConfig(({ mode }) => {
  const isCheckDisabled = mode === "production" || !!process.env.VITEST;

  return {
    plugins: [
      mode === "development" ? [devtools()] : [],
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
    build: {
      rolldownOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name(moduleId) {
                  return getChunkGroupName(moduleId);
                },
              },
            ],
          },
        },
      },
    },
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

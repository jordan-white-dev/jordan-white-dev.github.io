import { type KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx,js,jsx,css,scss}"],
  ignoreBinaries: ["changelogithub"],
};

export default config;

import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [],

  async viteFinal(config) {
    const basePath = process.env.STORYBOOK_BASE_PATH;

    // Default to root for local builds
    config.base = basePath ?? "/";

    return config;
  },
};

export default config;

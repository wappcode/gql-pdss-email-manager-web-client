import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "gql-pdss-email-manager-web-client",
      fileName: "gql-pdss-email-manager-web-client",
    },
  },
  plugins: [dts()],
  test: {},
});

import react from "@vitejs/plugin-react-swc";
import { defineConfig, transformWithEsbuild } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2048,
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },

  plugins: [
    // Get .js files to be treated as .jsx files with React syntax.
    // https://stackoverflow.com/a/76726872
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild.
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },

    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
});

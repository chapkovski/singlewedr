import { fileURLToPath, URL } from 'node:url'
// vite.config.js
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {watch: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    },
    outDir: '../_static/front', // Replace with the actual path to your Django static folder
  },
  plugins: [
    vue(),
    { 
      name: 'write-to-disk',
      writeBundle(options, bundle) {
        if (process.env.NODE_ENV !== 'development') {
          Object.keys(bundle).forEach((fileName) => {
            const filePath = path.resolve(__dirname, '../_static/front', fileName);
            fs.writeFileSync(filePath, bundle[fileName].code || bundle[fileName].source);
          });
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

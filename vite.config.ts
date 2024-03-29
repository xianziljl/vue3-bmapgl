import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            copyDtsFiles: false
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'vue3-bmapgl',
            formats: ['es'],
            fileName: (format) => `index.js`
        },
        rollupOptions: {
            external: ['vue']
        }
    }
})

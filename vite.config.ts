import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        // dts({
        //     exclude: ['types', 'src/env.d.ts']
        // }),
        vue()
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/components/index.ts'),
            name: 'vue3-bmapgl',
            formats: ['es'],
            fileName: (format) => `index.js`
        },
        rollupOptions: {
            external: ['vue']
        }
    }
})

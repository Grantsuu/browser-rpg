import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ReactCompilerConfig = { /* ... */ };

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    ["babel-plugin-react-compiler", ReactCompilerConfig],
                ]
            }
        }),
        tailwindcss()
    ],
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "src/"),
            "@components": path.resolve(__dirname, "src/components/"),
            "@constants": path.resolve(__dirname, "src/constants/"),
            "@contexts": path.resolve(__dirname, "src/contexts/"),
            "@features": path.resolve(__dirname, "src/features/"),
            "@layouts": path.resolve(__dirname, "src/layouts/"),
            "@lib": path.resolve(__dirname, "src/lib/"),
            "@types": path.resolve(__dirname, "src/types/"),
            "@utils": path.resolve(__dirname, "src/utils/")
        }
    },
    server: {
        port: 3000,
    },
    preview: {
        port: 3000,
    },
})

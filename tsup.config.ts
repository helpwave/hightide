import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/**/*.{ts,tsx}'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    outDir: 'dist',
    clean: true,
    splitting: false,
    minify: false,
    target: 'es2022',
})

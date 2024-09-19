import {babel} from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {defineConfig} from 'vite'

import pkg from './package.json'

const SUPPORT_TARGETS = browserslistToEsbuild()

export default defineConfig({
    plugins: [
        babel({
            babelHelpers: 'bundled',
            presets: [
                [
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'usage',
                        corejs: {version: 3, proposals: true},
                        // debug: true,
                    },
                ],
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            exclude: 'node_modules/**',
        }),
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: {
                index: './src/index.ts',
            },
            formats: ['es'],
        },
        rollupOptions: {
            external: [...Object.keys(pkg.dependencies)].flatMap((dep) => [dep, new RegExp(`^${dep}/.*`)]),
        },
        target: SUPPORT_TARGETS,
    },
})

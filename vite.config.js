import {
    defineConfig
} from 'vite';
import {
    ViteImageOptimizer
} from 'vite-plugin-image-optimizer';
import { resolve } from 'path';


export default defineConfig({
    root: './src',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname,'./src/index.html'),
                store: resolve(__dirname,'./src/store.html')
            }
        }
    },
    plugins: [
        ViteImageOptimizer({
            test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
            exclude: undefined,
            include: undefined,
            includePublic: true,
            logStats: true,
            ansiColors: true,
            // svg: {
            //     multipass: true,
            //     plugins: [{
            //             name: 'preset-default',
            //             params: {
            //                 overrides: {
            //                     cleanupNumericValues: false,
            //                     removeViewBox: false,
            //                 },
            //                 cleanupIDs: {
            //                     minify: false,
            //                     remove: false,
            //                 },
            //                 convertPathData: false,
            //             },
            //         },
            //         'sortAttrs',
            //         {
            //             name: 'addAttributesToSVGElement',
            //             params: {
            //                 attributes: [{
            //                     xmlns: 'http://www.w3.org/2000/svg'
            //                 }],
            //             },
            //         },
            //     ],
            // },
            png: {
                quality: 80,
            },
            jpeg: {
                quality: 80,
            },
            jpg: {
                quality: 80,
            },
            webp: {
                //lossless: true,
                quality: 80,
            },
            avif: {
                //lossless: true,
                quality: 70,
            },
        }),
    ]
});
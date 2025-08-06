import typescript from '@rollup/plugin-typescript';

export default [
    // CommonJS build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'dist',
            }),
        ],
        external: ['axios'],
    },
    // ES Module build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false, // Only generate declarations once
            }),
        ],
        external: ['axios'],
    },
];
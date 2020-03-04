import ts from '@wessberg/rollup-plugin-ts';
import css from 'rollup-plugin-css-porter';

const input = 'src/modules/Modality.tsx';
export default {
    input,
    output: [
        {
            file: 'lib/index.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        ts({
            tsconfig: 'tsconfig.json',
            browserslist: false,
        }),
        css({ raw: 'lib/react-modality.css', minified: 'lib/react-modality.min.css' }),
    ],
};

import {merge} from 'webpack-merge'
import common from './webpack.common.mjs';
import path from 'node:path';
import process from 'node:process'

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

export default merge(common, {
    mode: 'development',
    devServer: {
        static: [{
            directory: path.join(process.cwd(), 'public'),
            watch: false,
        }, {
            directory: path.join(process.cwd(), 'node_modules'),
            publicPath: '/node_modules',
            watch: false,
        }],
        hot: true,
        proxy: [
            {context: ['/api/shopify'], ...localProxy}
        ],
        watchFiles: {
            paths: 'src/**/*',
            options: {
                cwd: path.join(process.cwd(), '/')
            }
        },
    },
    devtool: 'inline-source-map',
    plugins: []
});

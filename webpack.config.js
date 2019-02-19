
var  path = require('path');

module.exports = {
    // entry: 'target/webapp/module/index/index.html',
    // resolve: {
    //     alias: {
    //         plugins: path.resolve(__dirname, './src/main/webapp/plugins/')
    //     },
    //     modules: ['./src/main/webapp/plugins', 'node_modules']
    // },
    // output: {
    //     filename: '[name].js',
    //     chunkFilename: "[name].[chunkHash:8].js",
    //     path: path.resolve(__dirname, 'src/main/webapp/dependence/AWEB/js'),
    //     libraryTarget: 'amd'
    // },
    devServer: {
        contentBase: [path.join(__dirname, 'target/webapp'), path.join(__dirname, 'target/webapp/module/index')],
        // compress: true,
        port: 9000,
        overlay: {
            warnings: true,
            errors: true
        }
    },
    module: {
        noParse: function(content) {
            return /controller-core.js$/.test(content);
        }
    }
};
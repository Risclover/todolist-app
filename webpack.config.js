const path = require('path');
var webpack = require("webpack");
var $ = require( "jquery" );

module.exports = {
    entry: './src/modules/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    externals: {
        jquery: 'jQuery',
        "jquery-ui": "jquery-ui/jquery-ui.js", 
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
     ],
};
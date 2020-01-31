const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    entry: "./resources/js/app.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',  
                            publicPath: '../fonts/' 
                        }
                    }
                ]
           }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/app.css',
            chunkFilename: '[id].css',
            ignoreOrder: false, 
        })
    ]
}
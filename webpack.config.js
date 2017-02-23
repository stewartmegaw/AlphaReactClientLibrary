var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

var config = {
    entry: './index.js',
    output: {
        filename: './dist/index.js',
        sourceMapFilename: './dist/index.map',
        library: 'alphareactclient',
        libraryTarget: 'umd'
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'validate.js': 'validate.js',
        'react-addons-transition-group': 'React.addons.TransitionGroup',
        'react-addons-pure-render-mixin': 'React.addons.PureRenderMixin',

    },
    module: {
        //Loaders to interpret non-vanilla javascript code as well as most other extensions including images and text.
        // preLoaders: [

        // ],
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    //eslint config options. Part of the eslint-loader package

};

module.exports = config;

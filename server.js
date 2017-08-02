// REACT
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./app/webpack.config.js');
var OutletControl = require('./index.js');

const express = require('express');
var app = express();

var path = require('path');
const isDeveloping = false;
const port = isDeveloping ? 3000 : 3000;


if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use(express.static(path.join(__dirname, 'dist')));
}


app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    new OutletControl(app, {}, false);
    console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});


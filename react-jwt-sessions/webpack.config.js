const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/client/src/app.jsx'),
    mode: 'development',
    output: {
        path: path.join(__dirname, '/client/dist/js'),
        filename: 'app.js'
    },

    module: {
        rules: [{
            test:/\.jsx?$/,
            include: path.join(__dirname, '/client/src'),
            use: ['babel-loader'],
        }],
    },
    plugins: [],
    watch: true
}
const path = require('path');
const webpack = require('webpack');


const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
	app: path.join(__dirname, '../src'),
	build: path.join(__dirname, '../public'),
};

process.env.BABEL_ENV = TARGET;

module.exports = {
	debug: true,
	devtool: 'eval-source-map',

	entry: [
		'webpack-hot-middleware/client',
		'./src/Router',
	],

	output: {
		publicPath: '/public',
		filename: 'public/bundle.js',
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"',
			},
			__DEVELOPMENT__: true,
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],

	resolve: {
		extensions: ['', '.jsx', '.js'],
		modulesDirectories: ['node_modules', PATHS.app]
	},

	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['babel-loader'],
			exclude: /node_modules/,
		}, {
			test: /\.css$/,
			loader: "style-loader!css-loader"
		},],
	},
};

var gulp = require('gulp');
var gutil = require('gulp-util');
var gconcat = require('gulp-concat');
var webpack = require('webpack');
var webpack_devserver = require('webpack-dev-server');
var webpack_config = require('./webpack.config.js');

gulp.task('default', ['webpack-dev-server']);

gulp.task('webpack-dev-server', function (cb) {
  var config = Object.create(webpack_config);
  config.devtool = 'eval';
  config.debug = true;

  new webpack_devserver(webpack(config), {
    publicPath: '/' + config.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost', function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

gulp.task('build-dev', ['webpack:build-dev'], function () {
  gulp.watch(['app/**/*'], ['webpack:build-dev']);
});

var dev_config = Object.create(webpack_config);
dev_config.devtool = 'sourcemap';
dev_config.debug = true;

var dev_compiler = webpack(dev_config);

gulp.task('webpack:build-dev', function (cb) {
  dev_compiler.run(function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-dev', err);
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true,
      hot: true,
      inline: true
    }));

    cb();
  });
});

gulp.task('build', ['webpack:build']);

gulp.task('webpack:build', function (cb) {
  var config = Object.create(webpack_config);
  gutil.log(config.plugins);
  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  webpack(config, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true,
      hot: true,
      inline: true
    }));

    cb();
  });
});

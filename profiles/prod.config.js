import uglify from 'rollup-plugin-uglify';
import base from './base.config.js';

export default Object.assign({}, base, {
  dest: 'dist/umd/esri-loader.min.js',
  plugins: [
    uglify()
  ],
  context: 'window'
});

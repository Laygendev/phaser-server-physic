import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

export default {
	input: 'src/index.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
	 plugins: [
    babel(babelrc())
  ]
};

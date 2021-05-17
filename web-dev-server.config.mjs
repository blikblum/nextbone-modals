import { fromRollup } from '@web/dev-server-rollup'
import rollupBabel from '@rollup/plugin-babel'
import rollupCommonjs from '@rollup/plugin-commonjs'

const babel = fromRollup(rollupBabel.default)
const commonjs = fromRollup(rollupCommonjs)

export default {
  plugins: [
    babel({ include: ['example/src/**/*.js'], babelHelpers: 'inline' }),
    commonjs({
      include: [
        // the commonjs plugin is slow, list the required packages explicitly:
        '**/node_modules/jquery/**/*',
      ],
    }),
  ],
}

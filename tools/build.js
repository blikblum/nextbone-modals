'use strict'

const fs = require('fs')
const del = require('del')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const pkg = require('../package.json')

let promise = Promise.resolve()

let dependencies = Object.assign({}, pkg.dependencies || {}, pkg.peerDependencies || {})

// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel
['es', 'umd'].forEach((format) => {
  promise = promise.then(() => rollup.rollup({
    input: 'src/index.js',
    external: Object.keys(dependencies),
    plugins: [babel({
      exclude: 'node_modules/**'
    })]
  }).then(bundle => bundle.write({
    file: `dist/${format === 'umd' ? 'marionette.modalservice' : 'marionette.modalservice.esm'}.js`,
    format,
    sourcemap: true,
    name: format === 'umd' ? pkg.name : undefined
  })))
})

promise.catch(err => console.error(err.stack)) // eslint-disable-line no-console

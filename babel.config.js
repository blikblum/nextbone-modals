module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': {
          'browsers': [
            'chrome 60'
          ]
        },
        'modules': false
      }
    ]
  ],
  'env': {
    'test': {
      'presets': [
        [
          '@babel/preset-env',
          {
            'targets': {
              'node': 'current'
            },
            'modules': 'commonjs'
          }
        ]
      ]
    }
  }
}

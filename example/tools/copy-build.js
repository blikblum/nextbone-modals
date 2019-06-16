const fs = require('fs')

fs.copyFileSync('../dist/nextbone-modals.js', './node_modules/nextbone-modals/dist/nextbone-modals.js')
fs.copyFileSync('../dist/nextbone-modals.js.map', './node_modules/nextbone-modals/dist/nextbone-modals.js.map')

import { createRequire } from 'module'
import '@testing-library/jest-dom'
import 'popper.js'

const require = createRequire(import.meta.url)

const $ = require('jquery')
window.jQuery = $
require('bootstrap/dist/js/bootstrap.js')

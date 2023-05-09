import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import { Bootstrap4Modals } from '../../../src/index.js'
import '../../bootstrap-shared/modals-example.js'

const modals = new Bootstrap4Modals()
modals.setup({
  container: '#main-modal-container',
})

const example = document.querySelector('modals-example')
example.modals = modals

import './jquerySetup.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import { BootstrapModals, setDefaultModals } from '../../../src/index.js'
import '../../bootstrap-shared/modals-example.js'

const modals = new BootstrapModals()
modals.setup({
  container: '#main-modal-container',
})

setDefaultModals(BootstrapModals)

const example = document.querySelector('modals-example')
example.modals = modals

import './jquerySetup.js'
import 'bootstrap'
import { BootstrapModals } from '../../../src/index.js'
import '../../bootstrap-shared/modals-example.js'

const modals = new BootstrapModals()
modals.setup({
  container: '#main-modal-container',
})

const example = document.querySelector('modals-example')
example.modals = modals
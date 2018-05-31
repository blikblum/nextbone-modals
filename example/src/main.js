import './setup'
import {Application} from 'backbone.marionette'
import {modals} from 'services'
import $ from 'jquery'
import IndexView from './index/view'

let App = Application.extend({
  region: '#main-view'
})

let app = new App()

modals.setup({
  el: '#main-modal-container'
})

app.getRegion().show(new IndexView())

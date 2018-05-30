import './setup'
import {Application, Region} from 'backbone.marionette'
import {modals} from 'modals'
import $ from 'jquery'
import IndexView from './index/view'

let App = Application.extend({
  region: '#main-view'
})

let app = new App()

let modalRegion = new Region({
  el: $('#main-modal-container')
})

modals.setup({
  container: modalRegion
})

app.getRegion().show(new IndexView())

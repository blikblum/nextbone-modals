import {View} from 'backbone.marionette'
import {modals} from 'services'

export default View.extend({
  template: `
    <div class="container">
      <h2>Modal Service Example</h2>
      <div class="row">
        <div class="col-md-3">
          <button id="alert" class="btn btn-primary">Alert</button>
        </div>
        <div class="col-md-3">
          <button id="confirm" class="btn btn-primary">Confirm</button>
        </div>
        <div class="col-md-3">
          <button id="prompt" class="btn btn-primary">Prompt</button>
        </div>
      </div>
      <div class="row">
        <h5>Log</h5>
        <div id="log"></div>
      </div>
    </div>
  `,

  events: {
    'click #alert': 'showAlert',
    'click #confirm': 'showConfirm',
    'click #prompt': 'showPrompt'
  },

  showAlert (e) {
    modals.request('alert', {
      title: 'Alert',
      text: `You are in danger!`
    }).then(val => this.log('alert', 'NA'))
  },

  showConfirm (e) {
    modals.request('confirm', {
      title: 'Confirmation',
      text: `Should i stay? Or should i go?`
    }).then(val => this.log('confirm', val))
  },

  showPrompt (e) {
    modals.request('prompt', {
      title: 'Prompt',
      text: `What is your name?`
    }).then(val => this.log('prompt', val))
  },

  log (type, msg) {
    this.$('#log').append(`${type}: ${msg} <br/>`)
  }
})

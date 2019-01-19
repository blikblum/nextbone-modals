import './setup'
import { BootstrapModals } from 'nextbone-modals'
import { event } from 'nextbone'

const modals = new BootstrapModals()
modals.setup({
  container: '#main-modal-container'
})

class ModalsExample extends HTMLElement {
  connectedCallback () {
    this.innerHTML = `
    <div class="container">
      <h2>Modal Service Example</h2>
      <div class="row" mt-2>
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
      <div class="row mt-4">
        <h5>Log</h5>        
      </div>
      <div class="row">
        <div id="log"></div>
      </div>
    </div>
  `
  }

  @event('click', '#alert')
  showAlert (e) {
    modals.request('alert', {
      title: 'Alert',
      text: `You are in danger!`
    }).then(val => this.log('alert', val))
  }

  @event('click', '#confirm')
  showConfirm (e) {
    modals.request('confirm', {
      title: 'Confirmation',
      text: `Should i stay? Or should i go?`
    }).then(val => this.log('confirm', val))
  }

  @event('click', '#prompt')
  showPrompt (e) {
    modals.request('prompt', {
      title: 'Prompt',
      text: `What is your name?`,
      value: 'Waldo'
    }).then(val => this.log('prompt', val))
  }

  log (type, msg) {
    this.$('#log').append(`${type}: ${msg} <br/>`)
  }  
}

customElements.define('modals-example', ModalsExample)

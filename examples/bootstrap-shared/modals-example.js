import $ from 'jquery'
import { delegate } from 'nextbone'
import './lorem-dialog.js'
import { showAlert, showConfirm, showDialog, showPrompt } from '../../src/default.js'

function stringifyArgs(args) {
  return args.map((item) => {
    if (item instanceof HTMLElement) {
      return `Element(${item.tagName})`
    } else if (item instanceof $.Event) {
      return `Event(${item.type})`
    } else {
      return JSON.stringify(item)
    }
  })
}

class ModalsExample extends HTMLElement {
  constructor() {
    super()

    delegate(this, 'click', '#alert', this.showAlert, this)
    delegate(this, 'click', '#confirm', this.showConfirm, this)
    delegate(this, 'click', '#prompt', this.showPrompt, this)
    delegate(this, 'click', '#dialog', this.showDialog, this)
    delegate(this, 'change', 'input[name="useDefaultService"]', this.inputHandler, this)
  }

  set modals(v) {
    this._modals = v
    this._modals.on('all', (name, ...args) => {
      $(this)
        .find('#events')
        .append(`${name} ${stringifyArgs(args)} <br/>`)
    })
  }

  get modals() {
    return this._modals
  }

  useDefaultService = false

  connectedCallback() {
    this.innerHTML = `
    <div class="container">
      <h2>Modal Service Example</h2>
      <div class="row mt-3">
        <div class="col-auto">
          <button id="alert" class="btn btn-primary">Alert</button>
        </div>
        <div class="col-auto">
          <button id="confirm" class="btn btn-primary">Confirm</button>
        </div>
        <div class="col-auto">
          <button id="prompt" class="btn btn-primary">Prompt</button>
        </div>
        <div class="col-auto">
          <button id="dialog" class="btn btn-primary">Dialog</button>
        </div>
        <div class="col-auto">
          <div class="form-check">
            <label class="form-label">
              <input type="checkbox" class="form-check-input" name="useDefaultService">
              Use default service
            </label>
          </div>          
        </div>
      </div>

      <div class="card mt-2">                
        <div class="card-body">
          <h4 class="card-title">Options</h4>
          <form name="options">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="form-check">
                  <label class="form-label">
                    <input type="checkbox" class="form-check-input" name="centered">
                    Centered
                  </label>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-check">
                  <label class="form-label">
                    <input type="checkbox" class="form-check-input" name="scrollable">
                    Scrollable
                  </label>
                </div>
              </div>
              <div class="col-auto">
                <div class="form-check">
                  <label class="form-label">
                    <input type="checkbox" class="form-check-input" name="fullscreen">
                    Fullscreen
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label class="form-label" for="size">Size</label>
                  <select class="form-select" name="size" id="size">
                    <option value="sm">Small</option>
                    <option value="" selected>Default</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra large</option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label class="form-label" for="size">Prompt input</label>
                  <select class="form-control" name="input">
                    <option value="" selected>Text input</option>
                    <option value="radiogroup">Radio group</option>                    
                  </select>
                </div>
              </div>                  
            </div>
          </form>      
        </div>
      </div>
      
      <div class="row mt-3">
        <div class="col">
          <h5>Log</h5>
          <div id="log"></div>
        </div>
        <div class="col-md-9">
          <h5>Events</h5>
          <div id="events"></div>
        </div>   
      </div>
    </div>
  `
  }

  inputHandler(e) {
    e.preventDefault()
    this.useDefaultService = e.target.checked
  }

  getOptions() {
    const formEl = this.querySelector('form[name="options"]')
    const data = new FormData(formEl)
    const result = {}
    for (let pair of data.entries()) {
      result[pair[0]] = pair[1]
    }
    return result
  }

  showAlert() {
    const options = this.getOptions()
    Object.assign(options, {
      title: 'Alert',
      text: `You are in danger!`,
    })
    if (this.useDefaultService) {
      showAlert(options).then((val) => this.log('alert', val))
    } else {
      this.modals.alert(options).then((val) => this.log('alert', val))
    }
  }

  showConfirm() {
    const options = this.getOptions()
    Object.assign(options, {
      title: 'Confirmation',
      text: `Should i stay? Or should i go?`,
    })

    if (this.useDefaultService) {
      showConfirm(options).then((val) => this.log('confirm', val))
    } else {
      this.modals.confirm(options).then((val) => this.log('confirm', val))
    }
  }

  showPrompt() {
    const options = this.getOptions()
    Object.assign(options, {
      title: 'Prompt',
      text: `What is your name?`,
      value: 'Waldo',
      items: [
        { name: 'The Great Waldo', value: 'Waldo' },
        { name: 'The Magnific Jones', value: 'Jones' },
      ],
    })

    if (this.useDefaultService) {
      showPrompt(options).then((val) => this.log('prompt', val))
    } else {
      this.modals.prompt(options).then((val) => this.log('prompt', val))
    }
  }

  showDialog() {
    const options = this.getOptions()
    const el = document.createElement('lorem-dialog')
    if (this.hasAttribute('bs-4')) {
      el.setAttribute('bs-4', '')
    }

    if (this.useDefaultService) {
      showDialog(el, options).then((val) => this.log('dialog', val))
    } else {
      this.modals.dialog(el, options).then((val) => this.log('dialog', val))
    }
  }

  log(type, msg) {
    $(this).find('#log').append(`${type}: ${msg} <br/>`)
  }
}

customElements.define('modals-example', ModalsExample)

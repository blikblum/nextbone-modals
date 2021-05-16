import { Events } from 'nextbone'

const defaultCaptions = {
  ok: 'OK',
  cancel: 'Cancel',
  yes: 'Yes',
  no: 'No',
}

class BaseModal extends HTMLElement {
  confirmClick() {
    this.trigger('confirm')
  }

  getInputValue() {
    return this.querySelector('input').value
  }

  submit(e) {
    e.preventDefault()
    const val = this.getInputValue()
    this.trigger('submit', val)
  }

  bindEvent(selector, event, listener) {
    const el = this.querySelector(selector)
    if (el) el.addEventListener(event, listener.bind(this))
  }

  connectedCallback() {
    this.innerHTML = this.render(this.options)
    this.bindEvent('.btn-primary', 'click', this.confirmClick)
    this.bindEvent('form', 'submit', this.submit)
  }
}

Events.extend(BaseModal.prototype)

class AlertView extends BaseModal {
  render(data) {
    return `
    <div class="modal-header">
      <h5 class="modal-title">${data.title}</h5>
      <button type="button" class="close" aria-hidden="true" data-dismiss="modal">&times;</button>      
    </div>

    <div class="modal-body">
      <p>${data.text}</p>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-primary">${data.ok || defaultCaptions.ok}</button>
    </div>
    `
  }
}

class PromptView extends BaseModal {
  connectedCallback() {
    super.connectedCallback()
    const { when } = this.options
    if (typeof when === 'function') {
      const okButton = this.querySelector('button.btn-primary')
      const input = this.querySelector('#modal__input--prompt')
      okButton.toggleAttribute('disabled', !when(input.value))
      input.addEventListener('input', () => {
        okButton.toggleAttribute('disabled', !when(input.value))
      })
    }
  }

  getInputValue() {
    const { input } = this.options
    switch (input) {
      case 'radiogroup':
        const checked = this.querySelector('input:checked')
        return checked ? checked.value : undefined

      default:
        return super.getInputValue()
    }
  }

  renderInput({ input, type = 'text', value, items = [], text }) {
    switch (input) {
      case 'radiogroup':
        return `${items
          .map(
            (item, index) => `<div class="form-check">
        <input class="form-check-input" type="radio" name="prompt" id="radio-item-${index}" value="${
              item.value
            }" ${value === item.value ? 'checked' : ''}>
        <label class="form-check-label" for="radio-item-${index}">
          ${item.name || ''}
        </label>
      </div>`
          )
          .join('')}`

      default:
        return `
        <label for="modal__input--prompt">${text}</label>
        <input id="modal__input--prompt" class="form-control" type="${type}" value="${
          value || ''
        }">`
    }
  }

  render(data) {
    return `
    <form>
      <div class="modal-header">
        <h5 class="modal-title">${data.title}</h5>
        <button type="button" class="close" aria-hidden="true" data-dismiss="modal">&times;</button>      
      </div>

      <div class="modal-body">
        <div class="form-group">          
          ${this.renderInput(data)}
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">${
          data.cancel || defaultCaptions.cancel
        }</button>
        <button type="submit" class="btn btn-primary">${data.ok || defaultCaptions.ok}</button>
      </div>
    </form>
    `
  }
}

class ConfirmView extends BaseModal {
  render(data) {
    return `
    <div class="modal-header">
      <h5 class="modal-title">${data.title}</h5>
      <button type="button" class="close" aria-hidden="true" data-dismiss="modal">&times;</button>      
    </div>
    
    <div class="modal-body">
      <p>${data.text}</p>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">${
        data.no || defaultCaptions.no
      }</button>
      <button type="button" class="btn btn-primary">${data.yes || defaultCaptions.yes}</button>
    </div>      
    `
  }
}

export { AlertView, ConfirmView, PromptView, defaultCaptions }

import { Events } from 'nextbone'

const defaultCaptions = {
  ok: 'OK',
  cancel: 'Cancel',
  yes: 'Yes',
  no: 'No'
}

class BaseModal extends HTMLElement {
  confirmClick () {
    this.trigger('confirm')
  }

  cancelClick (e) {
    e.stopPropagation()
    e.preventDefault()
    this.trigger('cancel')
  }

  submit (e) {
    e.preventDefault()
    const val = this.querySelector('input').value
    this.trigger('submit', val)
  }

  bindEvent (selector, event, listener) {
    const el = this.querySelector(selector)
    if (el) el.addEventListener(event, listener.bind(this))
  }

  connectedCallback () {
    this.innerHTML = this.render(this.options)
    this.bindEvent('.btn-primary', 'click', this.confirmClick)
    this.bindEvent('.close', 'click', this.cancelClick)
    this.bindEvent('.btn-secondary', 'click', this.cancelClick)
    this.bindEvent('form', 'submit', this.submit)
  }
}

Events.extend(BaseModal.prototype)

class AlertView extends BaseModal {
  render (data) {
    return `
    <div class="modal-header">
      <h5 class="modal-title">${data.title}</h5>
      <button type="button" class="close" aria-hidden="true">&times;</button>      
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
  render (data) {
    return `
    <form>
      <div class="modal-header">
        <h5 class="modal-title">${data.title}</h5>
        <button type="button" class="close" aria-hidden="true">&times;</button>      
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="modal__input--prompt">${data.text}</label>
          <input id="modal__input--prompt" class="form-control" type="text" value="${data.value || ''}">
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary">${data.cancel || defaultCaptions.cancel}</button>
        <button type="submit" class="btn btn-primary">${data.ok || defaultCaptions.ok}</button>
      </div>
    </form>
    `
  }
}

class ConfirmView extends BaseModal {
  render (data) {
    return `
    <div class="modal-header">
      <h5 class="modal-title">${data.title}</h5>
      <button type="button" class="close" aria-hidden="true">&times;</button>      
    </div>
    
    <div class="modal-body">
      <p>${data.text}</p>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary">${data.no || defaultCaptions.no}</button>
      <button type="button" class="btn btn-primary">${data.yes || defaultCaptions.yes}</button>
    </div>      
    `
  }
}

export { AlertView, ConfirmView, PromptView, defaultCaptions }

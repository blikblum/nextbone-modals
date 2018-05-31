import {Model} from 'backbone'
import {View} from 'backbone.marionette'

const defaultCaptions = {
  ok: 'OK',
  cancel: 'Cancel',
  no: 'No',
  yes: 'Yes'
}

const ModalView = View.extend({
  initialize (options = {}) {
    this.model = new Model(options)
  },

  triggers: {
    'click .btn-primary': {event: 'confirm', preventDefault: false, stopPropagation: false},
    'click .btn-secondary': 'cancel',
    'click .close': 'cancel'
  },

  events: {
    submit: 'submit'
  },

  submit (e) {
    e.preventDefault()
    var val = this.$('input').val()
    this.trigger('submit', val)
  }
})

// simple renderer for deafult views
const renderer = (template, data) => template(data)

const LayoutView = ModalView.extend({
  className: 'modal fade',

  attributes: {
    'tabindex': -1,
    'role': 'dialog'
  },

  template: function renderLayout () {
    return `
    <div class="modal-dialog">
      <div class="modal-content"></div>
    </div>
    `
  }
}).setRenderer(renderer)

const AlertView = ModalView.extend({
  template: function renderAlert (data) {
    return `
    <div class="modal-header">
      <h5 class="modal-title">${data.title}</h5>
      <button type="button" class="close" aria-hidden="true">&times;</button>      
    </div>

    <div class="modal-body">
      <p>${data.text}</p>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-primary">${defaultCaptions.ok}</button>
    </div>
    `
  }
}).setRenderer(renderer)

const PromptView = ModalView.extend({
  tagName: 'form',

  template: function renderPrompt (data) {
    return `
    <div class="modal-header">
      <h5 class="modal-title">${data.title}</h5>
      <button type="button" class="close" aria-hidden="true">&times;</button>      
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label for="modal__input--prompt">${data.text}</label>
        <input id="modal__input--prompt" class="form-control" type="text">
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary">${defaultCaptions.cancel}</button>
      <button type="submit" class="btn btn-primary">${defaultCaptions.ok}</button>
    </div>
    `
  }
}).setRenderer(renderer)

const ConfirmView = ModalView.extend({
  template: function renderConfirm (data) {
    return `
    <div class="modal-header">
      <h5 class="modal-title">${data.title}</h5>
      <button type="button" class="close" aria-hidden="true">&times;</button>      
    </div>
    
    <div class="modal-body">
      <p>${data.text}</p>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary">${defaultCaptions.no}</button>
      <button type="button" class="btn btn-primary">${defaultCaptions.yes}</button>
    </div>      
    `
  }

}).setRenderer(renderer)

export {ModalView, AlertView, LayoutView, ConfirmView, PromptView, defaultCaptions}

import ModalService from './service'
import {Model} from 'backbone'
import {View, Region, mergeOptions} from 'backbone.marionette'

const defaultCaptions = {
  ok: 'OK',
  cancel: 'Cancel',
  no: 'No',
  yes: 'Yes'
}

const defaultTemplates = {
  LayoutView: function renderLayout () {
    return `
    <div class="modal-dialog">
      <div class="modal-content"></div>
    </div>
    `
  },

  AlertView: function renderAlert (data) {
    return `
    <div class="modal-header">
      <button type="button" class="close" aria-hidden="true">&times;</button>
      <h4 class="modal-title">${data.title}}</h4>
    </div>

    <div class="modal-body">
      <p>${data.text}</p>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-primary">${defaultCaptions.ok}</button>
    </div>
    `
  },

  PromptView: function renderPrompt (data) {
    return `
    <div class="modal-header">
      <button type="button" class="close" aria-hidden="true">&times;</button>
      <h4 class="modal-title">${data.title}</h4>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label for="modal__input--prompt">${data.text}</label>
        <input id="modal__input--prompt" class="form-control" type="text">
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-default">${defaultCaptions.cancel}</button>
      <button type="submit" class="btn btn-primary">${defaultCaptions.ok}</button>
    </div>
    `
  },

  ConfirmView: function renderConfirm (data) {
    return `
    <div class="modal-header">
      <button type="button" class="close" aria-hidden="true">&times;</button>
      <h4 class="modal-title">${data.title}</h4>
    </div>
    
    <div class="modal-body">
      <p>${data.text}</p>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-default">${defaultCaptions.no}</button>
      <button type="button" class="btn btn-primary">${defaultCaptions.yes}</button>
    </div>      
    `
  }
}

const renderer = (template, data) => template(data)

const ModalView = View.extend({
  initialize (options = {}) {
    this.model = new Model(options)
  },

  triggers: {
    'click .btn-primary': 'confirm',
    'click .btn-default': 'cancel',
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

function createDefaultView (className) {
  return ModalView.extend({
    template: defaultTemplates[className]
  }).setRenderer(renderer)
}

const viewClassesNames = ['LayoutView', 'AlertView', 'PromptView', 'ConfirmView']

const BootstrapModalService = ModalService.extend({
  _prepareViewClasses () {
    viewClassesNames.forEach(className => {
      let ViewClass = this[className] || createDefaultView(className)
      if (typeof ViewClass !== 'function') {
        throw new Error(`ModalService: expected ${className} to be a template function or View class`)
      }
      if (!(ViewClass.prototype instanceof View)) {
        ViewClass = ModalView.extend({
          template: ViewClass
        })
        this[className] = ViewClass
      }
    })
  },

  setup (options = {}) {
    mergeOptions(this, options, viewClassesNames.concat(['container']))
    this._prepareViewClasses()
  },

  start () {
    const layout = this.layout = new this.LayoutView()
    this.container.show(layout)

    layout.$el.modal({
      show: false,
      backdrop: 'static'
    })

    layout.$el.on({
      'shown.bs.modal': (e) => this.trigger('modal:show', e),
      'hidden.bs.modal': (e) => this.trigger('modal:hide', e)
    })

    this.contentRegion = new Region({
      el: layout.$('.modal-content')
    })
  },

  render (view) {
    this.contentRegion.show(view)
  },

  remove () {
    this.contentRegion.reset()
  },

  animateIn () {
    return new Promise(resolve => {
      this.once('modal:show', resolve)
      this.layout.$el.modal('show')
    })
  },

  animateOut () {
    return new Promise(resolve => {
      this.once('modal:hide', resolve)
      this.layout.$el.modal('hide')
    })
  }
})

export default BootstrapModalService

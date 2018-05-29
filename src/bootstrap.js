import ModalService from './service'
import {View, Region, mergeOptions} from 'backbone.marionette'

const viewClassesNames = ['LayoutView', 'AlertView', 'PromptView', 'ConfirmView']

const BootstrapModalService = ModalService.extend({
  _prepareViewClasses () {
    viewClassesNames.forEach(className => {
      let ViewClass = this[className]
      if (typeof ViewClass !== 'function') {
        throw new Error(`ModalService: expected ${className} to be a template function or View class`)
      }
      if (!(ViewClass.prototype instanceof View)) {
        ViewClass = View.extend({
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

import $ from 'jquery'
import { Region } from 'nextbone/dom-utils'
import { Modals } from './service'
import { AlertView, PromptView, ConfirmView, defaultCaptions } from './bootstrap-views'

const layoutTemplate = `
<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content"></div>
  </div>
</div>
`

const elementClasses = {
  alert: AlertView,
  prompt: PromptView,
  confirm: ConfirmView
}

export class BootstrapModals extends Modals {
  static setCaptions (captions = {}) {
    Object.assign(defaultCaptions, captions)
  }

  setup (options = {}) {
    this.container = options.container
  }

  createElement (type) {
    const name = `bootstrap-modal-${type}`
    if (!customElements.get(name)) {
      customElements.define(name, elementClasses[type])
    }
    return document.createElement(name)
  }

  start () {
    if (!this.container) {
      throw new Error('Bootstrap Modals: container option is not defined')
    }

    const $container = $(this.container)
    if (!$container.length) {
      throw new Error(`Bootstrap Modals: unable to find container element (${this.container})`)
    }

    $container.html(layoutTemplate)

    const $layout = this.$layout = $container.children().eq(0)

    $layout.modal({
      show: false,
      backdrop: 'static'
    })

    $layout.on({
      'shown.bs.modal': (e) => this.trigger('modal:show', e),
      'hidden.bs.modal': (e) => this.trigger('modal:hide', e)
    })

    this.contentRegion = new Region($layout.find('.modal-content')[0])
  }

  render (view) {
    this.contentRegion.show(view)
  }

  remove () {
    this.contentRegion.empty()
  }

  animateIn () {
    return new Promise(resolve => {
      this.once('modal:show', resolve)
      this.$layout.modal('show')
    })
  }

  animateOut () {
    return new Promise(resolve => {
      this.once('modal:hide', resolve)
      this.$layout.modal('hide')
    })
  }
}

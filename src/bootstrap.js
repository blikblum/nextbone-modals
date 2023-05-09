import $ from 'jquery'
import { last } from 'lodash-es'
import { Region } from 'nextbone/dom-utils'
import { Modals } from './service.js'
import { AlertView, PromptView, ConfirmView, defaultCaptions } from './bootstrap-views.js'

const layoutTemplate = `
<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
  </div>
</div>
`

const elementClasses = {
  alert: AlertView,
  prompt: PromptView,
  confirm: ConfirmView,
}

const defaultOptions = {}

export class BootstrapModals extends Modals {
  static setCaptions(captions = {}) {
    Object.assign(defaultCaptions, captions)
  }

  static setOptions(options = {}) {
    Object.assign(defaultOptions, options)
  }

  setup(options = {}) {
    this.container = options.container
  }

  createElement(type) {
    const name = `bootstrap-modal-${type}`
    if (!customElements.get(name)) {
      customElements.define(name, elementClasses[type])
    }
    return document.createElement(name)
  }

  start() {
    if (!this.container) {
      throw new Error('Bootstrap Modals: container option is not defined')
    }

    const $container = $(this.container)
    if (!$container.length) {
      throw new Error(`Bootstrap Modals: unable to find container element (${this.container})`)
    }

    $container.html(layoutTemplate)

    const $layout = (this.$layout = $container.children().eq(0))

    $layout.modal({
      show: false,
      backdrop: 'static',
    })

    $layout.on({
      'shown.bs.modal': (e) => this.trigger('modal:show', e),
      'hidden.bs.modal': (e) => {
        // closed by bootstrap handler
        if (this.isOpen()) {
          // todo: get view from dom tree
          const view = last(this.views)
          const cancel = this.getCancelHandler(view)
          return cancel()
        }
        this.trigger('modal:hide', e)
      },
    })

    const $dialog = $layout.find('.modal-dialog')

    this.contentRegion = new Region($dialog[0])

    this.on('before:open', (view, options) => {
      const { size, scrollable, centered, fullscreen, customClass } = Object.assign(
        {},
        defaultOptions,
        options
      )
      let dialogClasses = ''
      if (size) {
        dialogClasses += ` modal-${size}`
      }
      if (scrollable) {
        dialogClasses += ` modal-dialog-scrollable`
      }
      if (centered) {
        dialogClasses += ` modal-dialog-centered`
      }
      if (fullscreen) {
        dialogClasses += ` modal-fullscreen`
      }
      if (customClass) {
        dialogClasses += ` ${customClass}`
      }

      if (dialogClasses) {
        $dialog.addClass(dialogClasses)
      }
      this.__dialogClasses = dialogClasses
    })

    this.on('close', () => {
      $dialog.removeClass(this.__dialogClasses)
    })
  }

  render(view) {
    view.classList.add('modal-content')
    this.contentRegion.show(view)
  }

  remove() {
    this.contentRegion.empty()
  }

  animateIn() {
    return new Promise((resolve) => {
      this.once('modal:show', resolve)
      this.$layout.modal('show')
    })
  }

  animateOut() {
    // if modal already hidden, i.e., closed by bootstrap handler, does nothing
    if (this.$layout.hasClass('show'))
      return new Promise((resolve) => {
        this.once('modal:hide', resolve)
        this.$layout.modal('hide')
      })
  }
}

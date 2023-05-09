import { Events } from 'nextbone'
import { defineAsyncMethods } from 'nextbone/class-utils'
import { last, without } from 'lodash-es'

const cancelHandlerMap = new WeakMap()

/**
 * @class Modals
 */
export class Modals extends Events {
  /**
   * @constructs Modals
   */
  constructor(channelName) {
    super(channelName)
    this.views = []
  }

  createElement(type) {
    return document.createElement(`nextbone-modal-${type}`)
  }

  getCancelHandler(view) {
    return cancelHandlerMap.get(view)
  }

  /**
   * @method open
   * @param {HTMLElement} [view]
   * @returns {Promise}
   */
  async open(view, options) {
    let previousView
    view.options = options
    this.trigger('before:open', view, options)
    this._isOpen = true

    previousView = last(this.views)
    this.views.push(view)

    await this.render(view, options)
    if (previousView) {
      await this.animateSwap(previousView, view, options)
    } else {
      await this.animateIn(view, options)
    }
    this.trigger('open', view, options)
  }

  /**
   * @method close
   * @param {HTMLElement} [view]
   * @returns {Promise}
   */
  async close(view, options) {
    let previousView
    let views

    if (view) {
      this.trigger('before:close', view, options)
    } else {
      this.views.map((view) => this.trigger('before:close', view, options))
    }

    this._isOpen = false

    if (view) {
      views = this.views = without(this.views, view)
    } else {
      views = this.views
      this.views = []
    }

    previousView = last(views)

    if (view && previousView) {
      await this.animateSwap(view, previousView, options)
    } else if (view) {
      await this.animateOut(view, options)
    } else if (previousView) {
      await this.animateOut(previousView, options)
    }

    if (view) {
      await this.remove(view, options)
    } else {
      await Promise.all(views.map((view) => this.remove(view, options)))
    }

    if (view) {
      this.trigger('close', view, options)
    } else {
      views.map((view) => this.trigger('close', view, options))
    }
  }

  /**
   * @method alert
   * @param {Object} [options]
   * @returns {Promise}
   */
  alert(options = {}) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('alert')
      let promise = this.open(view, options)

      this.trigger('before:alert', view, options)

      let cancel = () => {
        promise
          .then(() => this.close(view, options))
          .then(() => this.trigger('alert', null, view, options))
          .then(() => resolve(), reject)
      }

      cancelHandlerMap.set(view, cancel)

      view.on('confirm cancel', cancel)
    })
  }

  /**
   * @method confirm
   * @param {Object} [options]
   * @returns {Promise}
   */
  confirm(options = {}) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('confirm')
      let promise = this.open(view, options)

      this.trigger('before:confirm', view, options)

      let close = (result) => {
        promise
          .then(() => this.close(view, options))
          .then(() => this.trigger('confirm', result, view, options))
          .then(() => resolve(result), reject)
      }

      let cancel = () => close(false)

      cancelHandlerMap.set(view, cancel)

      view.on({
        confirm: () => close(true),
        cancel,
      })
    })
  }

  /**
   * @method prompt
   * @returns {Promise}
   */
  prompt(options = {}) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('prompt')
      let promise = this.open(view, options)

      this.trigger('before:prompt', view, options)

      let close = (result) => {
        promise
          .then(() => this.close(view, options))
          .then(() => this.trigger('prompt', result, view, options))
          .then(() => resolve(result), reject)
      }

      let cancel = () => close()

      cancelHandlerMap.set(view, cancel)

      view.on({
        submit: (text) => close(text),
        cancel,
      })
    })
  }

  dialog(view, options = {}) {
    if (!view) {
      throw new Error('ModalService: no view option passed to dialog')
    }
    return new Promise((resolve, reject) => {
      let promise = this.open(view, options)

      this.trigger('before:dialog', view, options)

      let close = (result) => {
        promise
          .then(() => this.close(view, options))
          .then(() => this.trigger('dialog', result, view, options))
          .then(() => resolve(result), reject)
      }

      let cancel = () => close()

      cancelHandlerMap.set(view, cancel)

      view.on({
        submit: (data) => close(data),
        cancel,
      })
    })
  }

  /**
   * @method isOpen
   * @returns {Boolean}
   */
  isOpen() {
    return !!this._isOpen
  }

  /**
   * @abstract
   * @method render
   */
  render() {}

  /**
   * @abstract
   * @method remove
   */
  remove() {}

  /**
   * @abstract
   * @method animateIn
   */
  animateIn() {}

  /**
   * @abstract
   * @method animateSwap
   */
  animateSwap() {}

  /**
   * @abstract
   * @method animateOut
   */
  animateOut() {}
}

defineAsyncMethods(Modals, ['open', 'close', 'confirm', 'prompt', 'dialog'])

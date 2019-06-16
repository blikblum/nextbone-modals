import { Events } from 'nextbone';
import { defineAsyncMethods } from 'nextbone/service';
import { last, without } from 'underscore';
import $ from 'jquery';
import { Region } from 'nextbone/dom-utils';

const cancelHandlerMap = new WeakMap();
/**
 * @class Modals
 */

class Modals extends Events {
  /**
   * @constructs Modals
   */
  constructor(channelName) {
    super(channelName);
    this.views = [];
  }

  createElement(type) {
    return document.createElement(`nextbone-modal-${type}`);
  }

  getCancelHandler(view) {
    return cancelHandlerMap.get(view);
  }
  /**
   * @method open
   * @param {HTMLElement} [view]
   * @returns {Promise}
   */


  open(view, options) {
    let previousView;
    view.options = options;
    return Promise.resolve().then(() => {
      this.trigger('before:open', view, options);
      this._isOpen = true;
      previousView = last(this.views);
      this.views.push(view);
      return this.render(view, options);
    }).then(() => {
      if (previousView) {
        return this.animateSwap(previousView, view, options);
      } else {
        return this.animateIn(view, options);
      }
    }).then(() => {
      this.trigger('open', view, options);
    });
  }
  /**
   * @method close
   * @param {HTMLElement} [view]
   * @returns {Promise}
   */


  close(view, options) {
    let previousView;
    let views;
    return Promise.resolve().then(() => {
      if (view) {
        this.trigger('before:close', view, options);
      } else {
        this.views.map(view => this.trigger('before:close', view, options));
      }

      this._isOpen = false;

      if (view) {
        views = this.views = without(this.views, view);
      } else {
        views = this.views;
        this.views = [];
      }

      previousView = last(views);

      if (view && previousView) {
        return this.animateSwap(view, previousView, options);
      } else if (view) {
        return this.animateOut(view, options);
      } else if (previousView) {
        return this.animateOut(previousView, options);
      }
    }).then(() => {
      if (view) {
        return this.remove(view, options);
      } else {
        return Promise.all(views.map(view => this.remove(view, options)));
      }
    }).then(() => {
      if (view) {
        this.trigger('close', view, options);
      } else {
        views.map(view => this.trigger('close', view, options));
      }
    });
  }
  /**
   * @method alert
   * @param {Object} [options]
   * @returns {Promise}
   */


  alert(options = {}) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('alert');
      let promise = this.open(view, options);
      this.trigger('before:alert', view, options);

      let cancel = () => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('alert', null, view, options)).then(() => resolve(), reject);
      };

      cancelHandlerMap.set(view, cancel);
      view.on('confirm cancel', cancel);
    });
  }
  /**
   * @method confirm
   * @param {Object} [options]
   * @returns {Promise}
   */


  confirm(options = {}) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('confirm');
      let promise = this.open(view, options);
      this.trigger('before:confirm', view, options);

      let close = result => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('confirm', result, view, options)).then(() => resolve(result), reject);
      };

      let cancel = () => close(false);

      cancelHandlerMap.set(view, cancel);
      view.on({
        confirm: () => close(true),
        cancel
      });
    });
  }
  /**
   * @method prompt
   * @returns {Promise}
   */


  prompt(options = {}) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('prompt');
      let promise = this.open(view, options);
      this.trigger('before:prompt', view, options);

      let close = result => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('prompt', result, view, options)).then(() => resolve(result), reject);
      };

      let cancel = () => close();

      cancelHandlerMap.set(view, cancel);
      view.on({
        submit: text => close(text),
        cancel
      });
    });
  }

  dialog(view, options = {}) {
    if (!view) {
      throw new Error('ModalService: no view option passed to dialog');
    }

    return new Promise((resolve, reject) => {
      let promise = this.open(view, options);
      this.trigger('before:dialog', view, options);

      let close = result => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('dialog', result, view, options)).then(() => resolve(result), reject);
      };

      let cancel = () => close();

      cancelHandlerMap.set(view, cancel);
      view.on({
        submit: data => close(data),
        cancel
      });
    });
  }
  /**
   * @method isOpen
   * @returns {Boolean}
   */


  isOpen() {
    return !!this._isOpen;
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
defineAsyncMethods(Modals, ['open', 'close', 'confirm', 'prompt', 'dialog']);

const defaultCaptions = {
  ok: 'OK',
  cancel: 'Cancel',
  yes: 'Yes',
  no: 'No'
};

class BaseModal extends HTMLElement {
  confirmClick() {
    this.trigger('confirm');
  }

  submit(e) {
    e.preventDefault();
    const val = this.querySelector('input').value;
    this.trigger('submit', val);
  }

  bindEvent(selector, event, listener) {
    const el = this.querySelector(selector);
    if (el) el.addEventListener(event, listener.bind(this));
  }

  connectedCallback() {
    this.innerHTML = this.render(this.options);
    this.bindEvent('.btn-primary', 'click', this.confirmClick);
    this.bindEvent('form', 'submit', this.submit);
  }

}

Events.extend(BaseModal.prototype);

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
    `;
  }

}

class PromptView extends BaseModal {
  render(data) {
    return `
    <form>
      <div class="modal-header">
        <h5 class="modal-title">${data.title}</h5>
        <button type="button" class="close" aria-hidden="true" data-dismiss="modal">&times;</button>      
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="modal__input--prompt">${data.text}</label>
          <input id="modal__input--prompt" class="form-control" type="text" value="${data.value || ''}">
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">${data.cancel || defaultCaptions.cancel}</button>
        <button type="submit" class="btn btn-primary">${data.ok || defaultCaptions.ok}</button>
      </div>
    </form>
    `;
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
      <button type="button" class="btn btn-secondary" data-dismiss="modal">${data.no || defaultCaptions.no}</button>
      <button type="button" class="btn btn-primary">${data.yes || defaultCaptions.yes}</button>
    </div>      
    `;
  }

}

const layoutTemplate = `
<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
  </div>
</div>
`;
const elementClasses = {
  alert: AlertView,
  prompt: PromptView,
  confirm: ConfirmView
};
class BootstrapModals extends Modals {
  static setCaptions(captions = {}) {
    Object.assign(defaultCaptions, captions);
  }

  setup(options = {}) {
    this.container = options.container;
  }

  createElement(type) {
    const name = `bootstrap-modal-${type}`;

    if (!customElements.get(name)) {
      customElements.define(name, elementClasses[type]);
    }

    return document.createElement(name);
  }

  start() {
    if (!this.container) {
      throw new Error('Bootstrap Modals: container option is not defined');
    }

    const $container = $(this.container);

    if (!$container.length) {
      throw new Error(`Bootstrap Modals: unable to find container element (${this.container})`);
    }

    $container.html(layoutTemplate);
    const $layout = this.$layout = $container.children().eq(0);
    $layout.modal({
      show: false,
      backdrop: 'static'
    });
    $layout.on({
      'shown.bs.modal': e => this.trigger('modal:show', e),
      'hidden.bs.modal': e => {
        // closed by bootstrap handler
        if (this.isOpen()) {
          // todo: get view from dom tree        
          const view = last(this.views);
          const cancel = this.getCancelHandler(view);
          return cancel();
        }

        this.trigger('modal:hide', e);
      }
    });
    const $dialog = $layout.find('.modal-dialog');
    this.contentRegion = new Region($dialog[0]);
    this.on('before:open', (view, options) => {
      const {
        size,
        scrollable,
        centered
      } = options;
      let dialogClasses = '';

      if (size) {
        dialogClasses += ` modal-${size}`;
      }

      if (scrollable) {
        dialogClasses += ` modal-dialog-scrollable`;
      }

      if (centered) {
        dialogClasses += ` modal-dialog-centered`;
      }

      if (dialogClasses) {
        $dialog.addClass(dialogClasses);
      }

      this.__dialogClasses = dialogClasses;
    });
    this.on('close', () => {
      $dialog.removeClass(this.__dialogClasses);
    });
  }

  render(view) {
    view.classList.add('modal-content');
    this.contentRegion.show(view);
  }

  remove() {
    this.contentRegion.empty();
  }

  animateIn() {
    return new Promise(resolve => {
      this.once('modal:show', resolve);
      this.$layout.modal('show');
    });
  }

  animateOut() {
    // if modal already hidden, i.e., closed by bootstrap handler, does nothing
    if (this.$layout.hasClass('show')) return new Promise(resolve => {
      this.once('modal:hide', resolve);
      this.$layout.modal('hide');
    });
  }

}

export { BootstrapModals, Modals };
//# sourceMappingURL=nextbone-modals.js.map

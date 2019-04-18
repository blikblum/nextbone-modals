import { Events } from 'nextbone';
import { defineAsyncMethods } from 'nextbone/service';
import { last, without } from 'underscore';
import $ from 'jquery';

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
  /**
   * @method open
   * @param {Backbone.View} [view]
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
   * @param {Backbone.View} [view]
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


  alert(options) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('alert');
      let promise = this.open(view, options);
      this.trigger('before:alert', view, options);
      view.on('confirm cancel', () => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('alert', null, view, options)).then(() => resolve(), reject);
      });
    });
  }
  /**
   * @method confirm
   * @param {Object} [options]
   * @returns {Promise}
   */


  confirm(options) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('confirm');
      let promise = this.open(view, options);
      this.trigger('before:confirm', view, options);

      let close = result => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('confirm', result, view, options)).then(() => resolve(result), reject);
      };

      view.on({
        confirm: () => close(true),
        cancel: () => close(false)
      });
    });
  }
  /**
   * @method prompt
   * @returns {Promise}
   */


  prompt(options) {
    return new Promise((resolve, reject) => {
      let view = this.createElement('prompt');
      let promise = this.open(view, options);
      this.trigger('before:prompt', view, options);

      let close = result => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('prompt', result, view, options)).then(() => resolve(result), reject);
      };

      view.on({
        submit: text => close(text),
        cancel: () => close()
      });
    });
  }

  dialog(view, options) {
    if (!view) {
      throw new Error('ModalService: no view option passed to dialog');
    }

    return new Promise((resolve, reject) => {
      let promise = this.open(view, options);
      this.trigger('before:dialog', view, options);

      let close = result => {
        promise.then(() => this.close(view, options)).then(() => this.trigger('dialog', result, view, options)).then(() => resolve(result), reject);
      };

      view.on({
        submit: data => close(data),
        cancel: () => close()
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
defineAsyncMethods(Modals, ['open', 'close', 'alert', 'confirm', 'prompt', 'dialog']);

class Region {
  constructor(targetEl) {
    this.targetEl = targetEl;
    this.isSwappingEl = false;
    this.currentEl = undefined;
  }

  show(el) {
    this.isSwappingEl = this.currentEl !== undefined;

    if (this.currentEl) {
      this.empty();
    }

    this.attachEl(el);
    this.currentEl = el;
    this.isSwappingEl = false;
  }

  empty() {
    if (this.currentEl) {
      this.detachEl(this.currentEl);
    }

    this.currentEl = undefined;
  }

  attachEl(el) {
    this.targetEl.appendChild(el);
  }

  detachEl(el) {
    this.targetEl.removeChild(el);
  }

}

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

  cancelClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.trigger('cancel');
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
    this.bindEvent('.close', 'click', this.cancelClick);
    this.bindEvent('.btn-secondary', 'click', this.cancelClick);
    this.bindEvent('form', 'submit', this.submit);
  }

}

Events.extend(BaseModal.prototype);

class AlertView extends BaseModal {
  render(data) {
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
    `;
  }

}

class PromptView extends BaseModal {
  render(data) {
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
    `;
  }

}

class ConfirmView extends BaseModal {
  render(data) {
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
    `;
  }

}

const layoutTemplate = `
<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content"></div>
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
      'hidden.bs.modal': e => this.trigger('modal:hide', e)
    });
    this.contentRegion = new Region($layout.find('.modal-content')[0]);
  }

  render(view) {
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
    return new Promise(resolve => {
      this.once('modal:hide', resolve);
      this.$layout.modal('hide');
    });
  }

}

export { Modals, BootstrapModals };
//# sourceMappingURL=nextbone-modals.js.map

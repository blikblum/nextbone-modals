import Service from 'radio.service';
import _ from 'underscore';
import { Model } from 'backbone';
import { View, Region, mergeOptions } from 'backbone.marionette';

/**
 * @class ModalService
 */
var ModalService = Service.extend({

  /**
   * @abstract
   * @method requests
   */
  requests: function requests() {
    return {
      open: 'open',
      close: 'close',
      alert: 'alert',
      confirm: 'confirm',
      prompt: 'prompt'
    };
  },


  /**
   * @constructs ModalService
   */
  constructor: function constructor() {
    this.views = [];

    Service.prototype.constructor.apply(this, arguments);
  },


  /**
   * @method open
   * @param {Backbone.View} [view]
   * @returns {Promise}
   */
  open: function open(view, options) {
    var _this = this;

    var previousView = void 0;
    return Promise.resolve().then(function () {
      _this.trigger('before:open', view, options);
      _this._isOpen = true;

      previousView = _.last(_this.views);
      _this.views.push(view);

      return _this.render(view, options);
    }).then(function () {
      if (previousView) {
        return _this.animateSwap(previousView, view, options);
      } else {
        return _this.animateIn(view, options);
      }
    }).then(function () {
      _this.trigger('open', view, options);
    });
  },


  /**
   * @method close
   * @param {Backbone.View} [view]
   * @returns {Promise}
   */
  close: function close(view, options) {
    var _this2 = this;

    var previousView = void 0;
    var views = void 0;

    return Promise.resolve().then(function () {
      if (view) {
        _this2.trigger('before:close', view, options);
      } else {
        _.map(_this2.views, function (view) {
          return _this2.trigger('before:close', view, options);
        });
      }

      _this2._isOpen = false;

      if (view) {
        views = _this2.views = _.without(_this2.views, view);
      } else {
        views = _this2.views;
        _this2.views = [];
      }

      previousView = _.last(views);

      if (view && previousView) {
        return _this2.animateSwap(view, previousView, options);
      } else if (view) {
        return _this2.animateOut(view, options);
      } else if (previousView) {
        return _this2.animateOut(previousView, options);
      }
    }).then(function () {
      if (view) {
        return _this2.remove(view, options);
      } else {
        return Promise.all(_.map(views, function (view) {
          return _this2.remove(view, options);
        }));
      }
    }).then(function () {
      if (view) {
        _this2.trigger('close', view, options);
      } else {
        _.map(views, function (view) {
          return _this2.trigger('close', view, options);
        });
      }
    });
  },


  /**
   * @method alert
   * @param {Object} [options]
   * @returns {Promise}
   */
  alert: function alert(options) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      var view = new _this3.AlertView(options);
      var promise = _this3.open(view, options);

      _this3.trigger('before:alert', view, options);

      view.on('confirm cancel', function () {
        promise.then(function () {
          return _this3.close(view, options);
        }).then(function () {
          return _this3.trigger('alert', null, view, options);
        }).then(function () {
          return resolve();
        }, reject);
      });
    });
  },


  /**
   * @method confirm
   * @param {Object} [options]
   * @returns {Promise}
   */
  confirm: function confirm(options) {
    var _this4 = this;

    return new Promise(function (resolve, reject) {
      var view = new _this4.ConfirmView(options);
      var promise = _this4.open(view, options);

      _this4.trigger('before:confirm', view, options);

      var close = function close(result) {
        promise.then(function () {
          return _this4.close(view, options);
        }).then(function () {
          return _this4.trigger('confirm', result, view, options);
        }).then(function () {
          return resolve(result);
        }, reject);
      };

      view.on({
        confirm: function confirm() {
          return close(true);
        },
        cancel: function cancel() {
          return close(false);
        }
      });
    });
  },


  /**
   * @method prompt
   * @returns {Promise}
   */
  prompt: function prompt(options) {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      var view = new _this5.PromptView(options);
      var promise = _this5.open(view, options);

      _this5.trigger('before:prompt', view, options);

      var close = function close(result) {
        promise.then(function () {
          return _this5.close(view, options);
        }).then(function () {
          return _this5.trigger('prompt', result, view, options);
        }).then(function () {
          return resolve(result);
        }, reject);
      };

      view.on({
        submit: function submit(text) {
          return close(text);
        },
        cancel: function cancel() {
          return close();
        }
      });
    });
  },


  /**
   * @method isOpen
   * @returns {Boolean}
   */
  isOpen: function isOpen() {
    return !!this._isOpen;
  },


  /**
   * @abstract
   * @method render
   */
  render: function render() {},


  /**
   * @abstract
   * @method remove
   */
  remove: function remove() {},


  /**
   * @abstract
   * @method animateIn
   */
  animateIn: function animateIn() {},


  /**
   * @abstract
   * @method animateSwap
   */
  animateSwap: function animateSwap() {},


  /**
   * @abstract
   * @method animateOut
   */
  animateOut: function animateOut() {}
});

var defaultCaptions = {
  ok: 'OK',
  cancel: 'Cancel',
  yes: 'Yes',
  no: 'No'
};

var ModalView = View.extend({
  initialize: function initialize() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.model = new Model(options);
  },


  triggers: {
    'click .btn-primary': { event: 'confirm', preventDefault: false, stopPropagation: false },
    'click .btn-secondary': 'cancel',
    'click .close': 'cancel'
  },

  events: {
    submit: 'submit'
  },

  submit: function submit(e) {
    e.preventDefault();
    var val = this.$('input').val();
    this.trigger('submit', val);
  }
});

// simple renderer for deafult views
var renderer = function renderer(template, data) {
  return template(data);
};

var LayoutView = ModalView.extend({
  className: 'modal fade',

  attributes: {
    'tabindex': -1,
    'role': 'dialog'
  },

  template: function renderLayout() {
    return '\n    <div class="modal-dialog">\n      <div class="modal-content"></div>\n    </div>\n    ';
  }
}).setRenderer(renderer);

var AlertView = ModalView.extend({
  template: function renderAlert(data) {
    return '\n    <div class="modal-header">\n      <h5 class="modal-title">' + data.title + '</h5>\n      <button type="button" class="close" aria-hidden="true">&times;</button>      \n    </div>\n\n    <div class="modal-body">\n      <p>' + data.text + '</p>\n    </div>\n\n    <div class="modal-footer">\n      <button type="button" class="btn btn-primary">' + (data.ok || defaultCaptions.ok) + '</button>\n    </div>\n    ';
  }
}).setRenderer(renderer);

var PromptView = ModalView.extend({
  tagName: 'form',

  template: function renderPrompt(data) {
    return '\n    <div class="modal-header">\n      <h5 class="modal-title">' + data.title + '</h5>\n      <button type="button" class="close" aria-hidden="true">&times;</button>      \n    </div>\n\n    <div class="modal-body">\n      <div class="form-group">\n        <label for="modal__input--prompt">' + data.text + '</label>\n        <input id="modal__input--prompt" class="form-control" type="text" value="' + (data.value || '') + '">\n      </div>\n    </div>\n\n    <div class="modal-footer">\n      <button type="button" class="btn btn-secondary">' + (data.cancel || defaultCaptions.cancel) + '</button>\n      <button type="submit" class="btn btn-primary">' + (data.ok || defaultCaptions.ok) + '</button>\n    </div>\n    ';
  }
}).setRenderer(renderer);

var ConfirmView = ModalView.extend({
  template: function renderConfirm(data) {
    return '\n    <div class="modal-header">\n      <h5 class="modal-title">' + data.title + '</h5>\n      <button type="button" class="close" aria-hidden="true">&times;</button>      \n    </div>\n    \n    <div class="modal-body">\n      <p>' + data.text + '</p>\n    </div>\n    \n    <div class="modal-footer">\n      <button type="button" class="btn btn-secondary">' + (data.no || defaultCaptions.no) + '</button>\n      <button type="button" class="btn btn-primary">' + (data.yes || defaultCaptions.yes) + '</button>\n    </div>      \n    ';
  }

}).setRenderer(renderer);

var viewClassesNames = ['LayoutView', 'AlertView', 'PromptView', 'ConfirmView'];

var BootstrapModalService = ModalService.extend({
  LayoutView: LayoutView,
  AlertView: AlertView,
  PromptView: PromptView,
  ConfirmView: ConfirmView,

  _prepareViewClasses: function _prepareViewClasses() {
    var _this = this;

    viewClassesNames.forEach(function (className) {
      var ViewClass = _this[className];
      if (typeof ViewClass !== 'function') {
        throw new Error('ModalService: expected ' + className + ' to be a template function or View class');
      }
      if (!(ViewClass.prototype instanceof View)) {
        ViewClass = ModalView.extend({
          template: ViewClass
        });
        _this[className] = ViewClass;
      }
    });
  },
  setup: function setup() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    mergeOptions(this, options, viewClassesNames.concat(['el', 'container']));
    this._prepareViewClasses();
  },
  start: function start() {
    var _this2 = this;

    var layout = this.layout = new this.LayoutView();

    if (!this.container) {
      if (!this.el) throw new Error('ModalService: container or el options must be defined');

      this.container = new Region({
        el: this.el
      });
    }
    this.container.show(layout);

    layout.$el.modal({
      show: false,
      backdrop: 'static'
    });

    layout.$el.on({
      'shown.bs.modal': function shownBsModal(e) {
        return _this2.trigger('modal:show', e);
      },
      'hidden.bs.modal': function hiddenBsModal(e) {
        return _this2.trigger('modal:hide', e);
      }
    });

    this.contentRegion = new Region({
      el: layout.$('.modal-content')
    });
  },
  render: function render(view) {
    this.contentRegion.show(view);
  },
  remove: function remove() {
    this.contentRegion.empty();
  },
  animateIn: function animateIn() {
    var _this3 = this;

    return new Promise(function (resolve) {
      _this3.once('modal:show', resolve);
      _this3.layout.$el.modal('show');
    });
  },
  animateOut: function animateOut() {
    var _this4 = this;

    return new Promise(function (resolve) {
      _this4.once('modal:hide', resolve);
      _this4.layout.$el.modal('hide');
    });
  }
},
// class methods
{
  setCaptions: function setCaptions() {
    var captions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Object.assign(defaultCaptions, captions);
  }
});

export { ModalService, BootstrapModalService };
//# sourceMappingURL=marionette.modalservice.esm.js.map

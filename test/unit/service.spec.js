/* eslint-env jest */

import {ModalService as Service} from '../../src/index'
import {View, history} from 'backbone'

describe('ModalService', function () {
  var ModalService
  beforeEach(function () {
    ModalService = Service.extend({
      render: jest.fn(),
      remove: jest.fn(),
      animateIn: jest.fn(),
      animateOut: jest.fn(),
      animateSwap: jest.fn()
    })
  })

  describe('#open', function () {
    var triggerSpy, modalService, view, options
    beforeEach(function () {
      modalService = new ModalService()
      triggerSpy = jest.spyOn(modalService, 'trigger')
    })

    describe('when no other modals are open', function () {
      beforeEach(function () {
        view = new View()
        options = {}
      })

      it('should trigger a "before:open" event', function () {
        return modalService.open(view, options).then(() => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('before:open', view, options)
        })
      })

      it('should render the view', function () {
        return modalService.open(view, options).then(() => {
          expect(modalService.render)
            .toHaveBeenCalledWith(view, options)
        })
      })

      it('should animate the view in', function () {
        return modalService.open(view, options).then(() => {
          expect(modalService.animateIn)
            .toHaveBeenCalledWith(view, options)
        })
      })

      it('should trigger a "before:open" event', function () {
        modalService.render = () => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('before:open', view, options)
        }

        return modalService.open(view, options)
      })

      it('should trigger a "open" event', function () {
        return modalService.open(view, options).then(() => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('open', view, options)
        })
      })
    })

    describe('when another modal is open', function () {
      var view1, view2
      beforeEach(function () {
        view1 = new View()
        view2 = new View()
        options = {}
        return modalService.open(view1)
      })

      it('should render the view', function () {
        return modalService.open(view2, options).then(() => {
          expect(modalService.render)
            .toHaveBeenCalledWith(view2, options)
        })
      })

      it('should animate the swapping of the views', function () {
        return modalService.open(view2, options).then(() => {
          expect(modalService.animateSwap)
            .toHaveBeenCalledWith(view1, view2, options)
        })
      })

      it('should trigger a "before:open" event', function () {
        modalService.render = () => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('before:open', view2, options)
        }

        return modalService.open(view2, options)
      })

      it('should trigger a "open" event', function () {
        return modalService.open(view2, options).then(() => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('open', view2, options)
        })
      })
    })
  })

  describe('#close', function () {
    var triggerSpy, modalService, view, options
    beforeEach(function () {
      modalService = new ModalService()
      triggerSpy = jest.spyOn(modalService, 'trigger')
    })

    describe('when no other modals were previously open', function () {
      beforeEach(function () {
        view = new View()
        options = {}
        return modalService.open(view)
      })

      it('should animate the view out', function () {
        return modalService.close(view, options).then(() => {
          expect(modalService.animateOut)
            .toHaveBeenCalledWith(view, options)
        })
      })

      it('should remove the view', function () {
        return modalService.close(view, options).then(() => {
          expect(modalService.remove)
            .toHaveBeenCalledWith(view, options)
        })
      })

      it('should trigger a "before:close" event', function () {
        modalService.remove = () => {
          expect(triggerSpy).toHaveBeenCalledWith('before:close', view, options)
        }

        return modalService.close(view, options)
      })

      it('should trigger a "close" event', function () {
        return modalService.close(view, options).then(() => {
          expect(triggerSpy).toHaveBeenCalledWith('close', view, options)
        })
      })
    })

    describe('when another modal was previously open', function () {
      var view1, view2
      beforeEach(function () {
        view1 = new View()
        view2 = new View()
        options = {}
        return modalService.open(view1).then(() => {
          return modalService.open(view2)
        })
      })

      it('should animate the swapping of the views', function () {
        return modalService.close(view2, options).then(() => {
          expect(modalService.animateSwap)
            .toHaveBeenCalledWith(view2, view1, options)
        })
      })

      it('should remove the view', function () {
        return modalService.close(view2, options).then(() => {
          expect(modalService.remove)
            .toHaveBeenCalledWith(view2, options)
        })
      })

      it('should trigger a "before:close" event', function () {
        modalService.remove = () => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('before:close', view2, options)
        }

        return modalService.close(view2, options)
      })

      it('should trigger a "close" event', function () {
        return modalService.close(view2, options).then(() => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('close', view2, options)
        })
      })
    })

    describe('when closing all modals', function () {
      var view1, view2
      beforeEach(function () {
        view1 = {view1: true}
        view2 = {view2: true}
        options = {}
        return modalService.open(view1).then(() => {
          return modalService.open(view2)
        })
      })

      it('should animate the current view out', function () {
        return modalService.close(null, options).then(() => {
          expect(modalService.animateOut)
            .toHaveBeenCalledWith(view2, options)
        })
      })

      it('should remove ALL OF THE VIEWS!!!', function () {
        return modalService.close(null, options).then(() => {
          expect(modalService.remove).toHaveBeenCalledWith(view1, options)
          expect(modalService.remove).toHaveBeenCalledWith(view2, options)
        })
      })

      it('should trigger a "before:close" event', function () {
        modalService.remove = () => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('before:close', view1, options)
          expect(triggerSpy)
            .toHaveBeenCalledWith('before:close', view2, options)
        }

        return modalService.close(null, options)
      })

      it('should trigger a "close" event', function () {
        return modalService.close(null, options).then(() => {
          expect(triggerSpy)
            .toHaveBeenCalledWith('close', view1, options)
          expect(triggerSpy)
            .toHaveBeenCalledWith('close', view2, options)
        })
      })
    })
  })

  describe('#alert', function () {
    var openSpy, closeSpy, triggerSpy
    var alertView, ModalService, modalService, options
    var AlertView = View.extend({
      constructor () {
        alertView = this
        View.prototype.constructor.apply(this, arguments)
      }
    })
    beforeEach(function () {
      ModalService = Service.extend({
        AlertView: AlertView
      })
      modalService = new ModalService()
      openSpy = jest.spyOn(modalService, 'open')
      closeSpy = jest.spyOn(modalService, 'close')
      triggerSpy = jest.spyOn(modalService, 'trigger')
      options = {}
    })

    it('should open the alert modal and resolve on confirm', function () {
      modalService.on('open', () => alertView.trigger('confirm'))

      return modalService.alert().then(() => {
        expect(openSpy).toHaveBeenCalledWith(alertView, undefined)
        expect(closeSpy).toHaveBeenCalledWith(alertView, undefined)
      })
    })

    it('should open the alert modal and close on cancel', function () {
      modalService.on('open', () => alertView.trigger('cancel'))

      return modalService.alert().then(() => {
        expect(openSpy).toHaveBeenCalledWith(alertView, undefined)
        expect(closeSpy).toHaveBeenCalledWith(alertView, undefined)
      })
    })

    it('should trigger a "before:alert" event', function () {
      modalService.on('open', () => {
        expect(triggerSpy)
          .toHaveBeenCalledWith('before:alert', alertView, options)
        alertView.trigger('confirm')
      })

      return modalService.alert(options)
    })

    it('should trigger a "alert" event', function () {
      modalService.on('open', () => alertView.trigger('confirm'))

      return modalService.alert(options).then(() => {
        expect(triggerSpy)
          .toHaveBeenCalledWith('alert', null, alertView, options)
      })
    })
  })

  describe('#confirm', function () {
    var confirmView, ModalService, modalService, options
    var openSpy, closeSpy, triggerSpy

    var ConfirmView = View.extend({
      constructor () {
        confirmView = this
        View.prototype.constructor.apply(this, arguments)
      }
    })
    beforeEach(function () {
      confirmView = new View()
      ModalService = Service.extend({
        ConfirmView: ConfirmView
      })
      modalService = new ModalService()
      openSpy = jest.spyOn(modalService, 'open')
      closeSpy = jest.spyOn(modalService, 'close')
      triggerSpy = jest.spyOn(modalService, 'trigger')
      options = {}
    })

    it('should open the confirm modal and resolve with true on confirm', function () {
      let confirm = modalService.confirm()

      Promise.resolve().then(() => confirmView.trigger('confirm'))

      return confirm.then(result => {
        expect(result).toBe(true)
        expect(openSpy).toHaveBeenCalledWith(confirmView, undefined)
        expect(closeSpy).toHaveBeenCalledWith(confirmView, undefined)
      })
    })

    it('should open the confirm modal and close with false on cancel', function () {
      let confirm = modalService.confirm()

      Promise.resolve().then(() => confirmView.trigger('cancel'))

      return confirm.then(result => {
        expect(result).toBe(false)
        expect(openSpy).toHaveBeenCalledWith(confirmView, undefined)
        expect(closeSpy).toHaveBeenCalledWith(confirmView, undefined)
      })
    })

    it('should trigger a "before:confirm" event', function () {
      modalService.on('open', () => {
        expect(triggerSpy)
          .toHaveBeenCalledWith('before:confirm', confirmView, options)
        confirmView.trigger('confirm')
      })

      return modalService.confirm(options)
    })

    it('should trigger a "confirm" event', function () {
      modalService.on('open', () => confirmView.trigger('confirm'))

      return modalService.confirm(options).then(() => {
        expect(triggerSpy)
          .toHaveBeenCalledWith('confirm', true, confirmView, options)
      })
    })
  })

  describe('#prompt', function () {
    var openSpy
    var closeSpy
    var triggerSpy
    var promptView, modalService, ModalService, options

    var PromptView = View.extend({
      constructor () {
        promptView = this
        View.prototype.constructor.apply(this, arguments)
      }
    })

    beforeEach(function () {
      promptView = new View()
      ModalService = Service.extend({
        PromptView: PromptView
      })
      modalService = new ModalService()
      openSpy = jest.spyOn(modalService, 'open')
      closeSpy = jest.spyOn(modalService, 'close')
      triggerSpy = jest.spyOn(modalService, 'trigger')
      options = {}
    })

    it('should open the prompt modal and resolve with string on submit', function () {
      modalService.on('open', () => promptView.trigger('submit', 'myString'))

      return modalService.prompt().then(result => {
        expect(result).toBe('myString')
        expect(openSpy).toHaveBeenCalledWith(promptView, undefined)
        expect(closeSpy).toHaveBeenCalledWith(promptView, undefined)
      })
    })

    it('should open the prompt modal and close with undefined on cancel', function () {
      modalService.on('open', () => promptView.trigger('cancel', 'devilsAdvocateString'))

      return modalService.prompt().then(result => {
        expect(result).toBeUndefined
        expect(openSpy).toHaveBeenCalledWith(promptView, undefined)
        expect(closeSpy).toHaveBeenCalledWith(promptView, undefined)
      })
    })

    it('should trigger a "before:prompt" event', function () {
      modalService.on('open', () => {
        expect(triggerSpy)
          .toHaveBeenCalledWith('before:prompt', promptView, options)
        promptView.trigger('submit', 'myString')
      })

      return modalService.prompt(options)
    })

    it('should trigger a "prompt" event', function () {
      modalService.on('open', () => promptView.trigger('submit', 'myString'))

      return modalService.prompt(options).then(() => {
        expect(triggerSpy)
          .toHaveBeenCalledWith('prompt', 'myString', promptView, options)
      })
    })
  })

  describe('#isOpen', function () {
    var modalService
    beforeEach(function () {
      modalService = new ModalService()
    })

    it('should return false when never opened', function () {
      expect(modalService.isOpen()).toBe(false)
    })

    it('should return true when opened', function () {
      return modalService.open().then(() => {
        expect(modalService.isOpen()).toBe(true)
      })
    })

    it('should return false after closed', function () {
      return modalService.open().then(() => {
        return modalService.close()
      }).then(() => {
        expect(modalService.isOpen()).toBe(false)
      })
    })
  })

  describe('requests', function () {
    var modalService
    beforeEach(function () {
      modalService = new ModalService()
    })

    it('should have a request for open', function () {
      var openSpy = jest.spyOn(modalService, 'open')
      openSpy.mockImplementation(() => {})
      return modalService.request('open').then(() => {
        expect(openSpy).toHaveBeenCalled
      })
    })

    it('should have a request for close', function () {
      var closeSpy = jest.spyOn(modalService, 'close')
      closeSpy.mockImplementation(() => {})
      return modalService.request('close').then(() => {
        expect(closeSpy).toHaveBeenCalled
      })
    })

    it('should have a request for alert', function () {
      var alertSpy = jest.spyOn(modalService, 'alert')
      alertSpy.mockImplementation(() => {})
      return modalService.request('alert').then(() => {
        expect(alertSpy).toHaveBeenCalled
      })
    })

    it('should have a request for confirm', function () {
      var confirmSpy = jest.spyOn(modalService, 'confirm')
      confirmSpy.mockImplementation(() => {})
      return modalService.request('confirm').then(() => {
        expect(confirmSpy).toHaveBeenCalled
      })
    })

    it('should have a request for prompt', function () {
      var promptSpy = jest.spyOn(modalService, 'prompt')
      promptSpy.mockImplementation(() => {})
      return modalService.request('prompt').then(() => {
        expect(promptSpy).toHaveBeenCalled
      })
    })
  })

  describe('Backbone.history', function () {
    var view1, view2, modalService, closeSpy
    beforeEach(function () {
      view1 = new View()
      view2 = new View()
      modalService = new ModalService()

      closeSpy = jest.spyOn(modalService, 'close')

      history.fragment = 'current'

      return Promise.all([
        modalService.open(view1),
        modalService.open(view2)
      ])
    })

    it('should close all modals when changing routes', function () {
      history.fragment = 'new-route'
      history.trigger('route')

      return Promise.resolve().then(() => {
        expect(closeSpy).toHaveBeenCalled
      })
    })

    it('should not close all modals when not route change is fired on the same route', function () {
      history.trigger('route')

      return Promise.resolve().then(() => {
        expect(closeSpy).not.toHaveBeenCalled
      })
    })
  })
})

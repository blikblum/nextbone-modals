/* eslint-env jest */
import { jest } from '@jest/globals'
import { Modals } from '../../src/index'
import { Events } from 'nextbone'

function View() {}

describe('Modals', function () {
  var ModalService
  beforeEach(function () {
    ModalService = class extends Modals {
      createElement(type) {
        const result = document.createElement(`modal-${type}`)
        Events.extend(result)
        return result
      }
    }
    jest.spyOn(ModalService.prototype, 'render')
    jest.spyOn(ModalService.prototype, 'remove')
    jest.spyOn(ModalService.prototype, 'animateIn')
    jest.spyOn(ModalService.prototype, 'animateOut')
    jest.spyOn(ModalService.prototype, 'animateSwap')
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
          expect(triggerSpy).toHaveBeenCalledWith('before:open', view, options)
        })
      })

      it('should render the view', function () {
        return modalService.open(view, options).then(() => {
          expect(modalService.render).toHaveBeenCalledWith(view, options)
        })
      })

      it('should animate the view in', function () {
        return modalService.open(view, options).then(() => {
          expect(modalService.animateIn).toHaveBeenCalledWith(view, options)
        })
      })

      it('should trigger a "before:open" event', function () {
        modalService.render = () => {
          expect(triggerSpy).toHaveBeenCalledWith('before:open', view, options)
        }

        return modalService.open(view, options)
      })

      it('should trigger a "open" event', function () {
        return modalService.open(view, options).then(() => {
          expect(triggerSpy).toHaveBeenCalledWith('open', view, options)
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
          expect(modalService.render).toHaveBeenCalledWith(view2, options)
        })
      })

      it('should animate the swapping of the views', function () {
        return modalService.open(view2, options).then(() => {
          expect(modalService.animateSwap).toHaveBeenCalledWith(view1, view2, options)
        })
      })

      it('should trigger a "before:open" event', function () {
        modalService.render = () => {
          expect(triggerSpy).toHaveBeenCalledWith('before:open', view2, options)
        }

        return modalService.open(view2, options)
      })

      it('should trigger a "open" event', function () {
        return modalService.open(view2, options).then(() => {
          expect(triggerSpy).toHaveBeenCalledWith('open', view2, options)
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
          expect(modalService.animateOut).toHaveBeenCalledWith(view, options)
        })
      })

      it('should remove the view', function () {
        return modalService.close(view, options).then(() => {
          expect(modalService.remove).toHaveBeenCalledWith(view, options)
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
          expect(modalService.animateSwap).toHaveBeenCalledWith(view2, view1, options)
        })
      })

      it('should remove the view', function () {
        return modalService.close(view2, options).then(() => {
          expect(modalService.remove).toHaveBeenCalledWith(view2, options)
        })
      })

      it('should trigger a "before:close" event', function () {
        modalService.remove = () => {
          expect(triggerSpy).toHaveBeenCalledWith('before:close', view2, options)
        }

        return modalService.close(view2, options)
      })

      it('should trigger a "close" event', function () {
        return modalService.close(view2, options).then(() => {
          expect(triggerSpy).toHaveBeenCalledWith('close', view2, options)
        })
      })
    })

    describe('when closing all modals', function () {
      var view1, view2
      beforeEach(function () {
        view1 = { view1: true }
        view2 = { view2: true }
        options = {}
        return modalService.open(view1).then(() => {
          return modalService.open(view2)
        })
      })

      it('should animate the current view out', function () {
        return modalService.close(null, options).then(() => {
          expect(modalService.animateOut).toHaveBeenCalledWith(view2, options)
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
          expect(triggerSpy).toHaveBeenCalledWith('before:close', view1, options)
          expect(triggerSpy).toHaveBeenCalledWith('before:close', view2, options)
        }

        return modalService.close(null, options)
      })

      it('should trigger a "close" event', function () {
        return modalService.close(null, options).then(() => {
          expect(triggerSpy).toHaveBeenCalledWith('close', view1, options)
          expect(triggerSpy).toHaveBeenCalledWith('close', view2, options)
        })
      })
    })
  })

  describe('#alert', function () {
    var openSpy, closeSpy, triggerSpy, createElementSpy
    var alertView, modalService, options
    beforeEach(function () {
      modalService = new ModalService()
      createElementSpy = jest.spyOn(modalService, 'createElement').mockImplementation(() => {
        alertView = new Events()
        return alertView
      })
      openSpy = jest.spyOn(modalService, 'open')
      closeSpy = jest.spyOn(modalService, 'close')
      triggerSpy = jest.spyOn(modalService, 'trigger')
      options = {}
    })

    it('should call createElement with "alert" type', async function () {
      const alert = modalService.alert()
      await Promise.resolve()
      alertView.trigger('confirm')
      await alert
      expect(createElementSpy).toHaveBeenCalledWith('alert')
    })

    it('should open the alert modal and resolve on confirm', function () {
      const options = {}
      modalService.on('open', () => alertView.trigger('confirm'))

      return modalService.alert(options).then(() => {
        expect(openSpy).toHaveBeenCalledWith(alertView, options)
        expect(closeSpy).toHaveBeenCalledWith(alertView, options)
      })
    })

    it('should open the alert modal and close on cancel', function () {
      const options = {}
      modalService.on('open', () => alertView.trigger('cancel'))

      return modalService.alert(options).then(() => {
        expect(openSpy).toHaveBeenCalledWith(alertView, options)
        expect(closeSpy).toHaveBeenCalledWith(alertView, options)
      })
    })

    it('should trigger a "before:alert" event', function () {
      modalService.on('open', () => {
        expect(triggerSpy).toHaveBeenCalledWith('before:alert', alertView, options)
        alertView.trigger('confirm')
      })

      return modalService.alert(options)
    })

    it('should trigger a "alert" event', function () {
      modalService.on('open', () => alertView.trigger('confirm'))

      return modalService.alert(options).then(() => {
        expect(triggerSpy).toHaveBeenCalledWith('alert', null, alertView, options)
      })
    })
  })

  describe('#confirm', function () {
    var confirmView, modalService, options
    var openSpy, closeSpy, triggerSpy, createElementSpy

    beforeEach(function () {
      modalService = new ModalService()
      createElementSpy = jest.spyOn(modalService, 'createElement').mockImplementation(() => {
        confirmView = new Events()
        return confirmView
      })
      openSpy = jest.spyOn(modalService, 'open')
      closeSpy = jest.spyOn(modalService, 'close')
      triggerSpy = jest.spyOn(modalService, 'trigger')
      options = {}
    })

    it('should call createElement with "confirm" type', async function () {
      const confirm = modalService.confirm()
      await Promise.resolve()
      confirmView.trigger('confirm')
      await confirm
      expect(createElementSpy).toHaveBeenCalledWith('confirm')
    })

    it('should open the confirm modal and resolve with true on confirm', function () {
      const options = {}
      let confirm = modalService.confirm(options)

      Promise.resolve().then(() => confirmView.trigger('confirm'))

      return confirm.then((result) => {
        expect(result).toBe(true)
        expect(openSpy).toHaveBeenCalledWith(confirmView, options)
        expect(closeSpy).toHaveBeenCalledWith(confirmView, options)
      })
    })

    it('should open the confirm modal and close with false on cancel', function () {
      const options = {}
      let confirm = modalService.confirm(options)

      Promise.resolve().then(() => confirmView.trigger('cancel'))

      return confirm.then((result) => {
        expect(result).toBe(false)
        expect(openSpy).toHaveBeenCalledWith(confirmView, options)
        expect(closeSpy).toHaveBeenCalledWith(confirmView, options)
      })
    })

    it('should trigger a "before:confirm" event', function () {
      modalService.on('open', () => {
        expect(triggerSpy).toHaveBeenCalledWith('before:confirm', confirmView, options)
        confirmView.trigger('confirm')
      })

      return modalService.confirm(options)
    })

    it('should trigger a "confirm" event', function () {
      modalService.on('open', () => confirmView.trigger('confirm'))

      return modalService.confirm(options).then(() => {
        expect(triggerSpy).toHaveBeenCalledWith('confirm', true, confirmView, options)
      })
    })
  })

  describe('#prompt', function () {
    var openSpy, closeSpy, triggerSpy, createElementSpy
    var promptView, modalService, options

    beforeEach(function () {
      modalService = new ModalService()
      createElementSpy = jest.spyOn(modalService, 'createElement').mockImplementation(() => {
        promptView = new Events()
        return promptView
      })
      openSpy = jest.spyOn(modalService, 'open')
      closeSpy = jest.spyOn(modalService, 'close')
      triggerSpy = jest.spyOn(modalService, 'trigger')
      options = {}
    })

    it('should call createElement with "prompt" type', async function () {
      const prompt = modalService.prompt()
      await Promise.resolve()
      promptView.trigger('submit')
      await prompt
      expect(createElementSpy).toHaveBeenCalledWith('prompt')
    })

    it('should open the prompt modal and resolve with string on submit', function () {
      const options = {}
      modalService.on('open', () => promptView.trigger('submit', 'myString'))

      return modalService.prompt(options).then((result) => {
        expect(result).toBe('myString')
        expect(openSpy).toHaveBeenCalledWith(promptView, options)
        expect(closeSpy).toHaveBeenCalledWith(promptView, options)
      })
    })

    it('should open the prompt modal and close with undefined on cancel', function () {
      const options = {}
      modalService.on('open', () => promptView.trigger('cancel', 'devilsAdvocateString'))

      return modalService.prompt(options).then((result) => {
        expect(result).toBeUndefined()
        expect(openSpy).toHaveBeenCalledWith(promptView, options)
        expect(closeSpy).toHaveBeenCalledWith(promptView, options)
      })
    })

    it('should trigger a "before:prompt" event', function () {
      modalService.on('open', () => {
        expect(triggerSpy).toHaveBeenCalledWith('before:prompt', promptView, options)
        promptView.trigger('submit', 'myString')
      })

      return modalService.prompt(options)
    })

    it('should trigger a "prompt" event', function () {
      modalService.on('open', () => promptView.trigger('submit', 'myString'))

      return modalService.prompt(options).then(() => {
        expect(triggerSpy).toHaveBeenCalledWith('prompt', 'myString', promptView, options)
      })
    })
  })

  describe('#dialog', function () {
    var openSpy
    var closeSpy
    var triggerSpy
    var dialogView, modalService, options

    beforeEach(function () {
      dialogView = new Events()
      modalService = new Modals()
      openSpy = jest.spyOn(modalService, 'open')
      closeSpy = jest.spyOn(modalService, 'close')
      triggerSpy = jest.spyOn(modalService, 'trigger')
      options = {}
    })

    it('should throws when a view instance is not passed as option', function () {
      return expect(modalService.dialog()).rejects.toThrow(
        'ModalService: no view option passed to dialog'
      )
    })

    it('should open the dialog modal and resolve with arbitrary data on submit', function () {
      const data = { key: 'value' }
      const options = {}
      modalService.on('open', () => dialogView.trigger('submit', data))

      return modalService.dialog(dialogView, options).then((result) => {
        expect(result).toBe(data)
        expect(openSpy).toHaveBeenCalledWith(dialogView, options)
        expect(closeSpy).toHaveBeenCalledWith(dialogView, options)
      })
    })

    it('should open the dialog modal and close with undefined on cancel', function () {
      const options = {}
      modalService.on('open', () => dialogView.trigger('cancel', 'devilsAdvocateString'))

      return modalService.dialog(dialogView, options).then((result) => {
        expect(result).toBeUndefined()
        expect(openSpy).toHaveBeenCalledWith(dialogView, options)
        expect(closeSpy).toHaveBeenCalledWith(dialogView, options)
      })
    })

    it('should trigger a "before:dialog" event', function () {
      modalService.on('open', () => {
        expect(triggerSpy).toHaveBeenCalledWith('before:dialog', dialogView, options)
        dialogView.trigger('submit', 'myString')
      })

      return modalService.dialog(dialogView, options)
    })

    it('should trigger a "dialog" event', function () {
      modalService.on('open', () => dialogView.trigger('submit', 'myString'))

      return modalService.dialog(dialogView, options).then(() => {
        expect(triggerSpy).toHaveBeenCalledWith('dialog', 'myString', dialogView, options)
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
      return modalService.open({}).then(() => {
        expect(modalService.isOpen()).toBe(true)
      })
    })

    it('should return false after closed', function () {
      return modalService
        .open({})
        .then(() => {
          return modalService.close()
        })
        .then(() => {
          expect(modalService.isOpen()).toBe(false)
        })
    })
  })
})

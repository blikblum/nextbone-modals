/* eslint-env jest */

import {
  BootstrapModals,
  getModalsService,
  setDefaultModals,
  showAlert,
  showConfirm,
  showDialog,
  showPrompt,
} from '../../src/index.js'

import { releaseDefaultModals } from '../../src/default.js'

describe('default service', () => {
  it('should throw if not defined', () => {
    expect(() => {
      showAlert({})
    }).toThrow('Default Modals service is not set')

    expect(() => {
      showPrompt({})
    }).toThrow('Default Modals service is not set')

    expect(() => {
      showDialog({})
    }).toThrow('Default Modals service is not set')

    expect(() => {
      showConfirm({})
    }).toThrow('Default Modals service is not set')
  })

  describe('setDefaultModals', () => {
    afterEach(() => {
      releaseDefaultModals()
    })

    it('should set the default modals service', () => {
      setDefaultModals(BootstrapModals)
      expect(async () => {
        const modals = getModalsService()
        modals.on('open', () => {
          const view = modals.container.querySelector('bootstrap-modal-alert')
          view.trigger('confirm')
        })
        await showAlert({})
      }).not.toThrow()
    })
  })

  describe('helper functions', () => {
    beforeEach(() => {
      setDefaultModals(BootstrapModals)
    })

    afterEach(() => {
      releaseDefaultModals()
    })

    it.skip('showAlert', async () => {
      const modals = getModalsService()
      modals.on('open', () => {
        const view = modals.container.querySelector('bootstrap-modal-alert')
        view.trigger('confirm')
      })
      await showAlert({ message: 'test' })
    })
  })
})

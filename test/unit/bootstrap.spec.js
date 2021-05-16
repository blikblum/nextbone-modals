/* eslint-env jest */

import { BootstrapModals } from '../../src/bootstrap'
import { Events } from 'nextbone'

describe('Bootstrap', () => {
  let modals
  let container
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    modals = new BootstrapModals()
    modals.onError = (err) => {
      throw err
    }
    modals.setup({ container })
  })

  afterEach(() => {
    container.remove()
  })

  describe('#prompt', () => {
    it('should render a text input by default', async () => {
      modals.on('open', () => {
        const view = container.querySelector('bootstrap-modal-prompt')
        const input = view.querySelector('#modal__input--prompt')

        expect(input.tagName).toBe('INPUT')
        expect(input).toHaveAttribute('type', 'text')
        expect(input).toHaveAttribute('value', 'test')
        view.trigger('submit')
      })
      await modals.prompt({ value: 'test' })
    })

    it('should resolve to input value', async () => {
      modals.on('open', () => {
        const view = container.querySelector('bootstrap-modal-prompt')
        const input = view.querySelector('#modal__input--prompt')
        const submitButton = view.querySelector('button[type="submit"]')
        input.value = 'hello'
        submitButton.click()
      })
      const result = await modals.prompt({ value: 'test' })
      expect(result).toBe('hello')
    })

    it('should allow to configure input type', async () => {
      modals.on('open', () => {
        const view = container.querySelector('bootstrap-modal-prompt')
        const input = view.querySelector('#modal__input--prompt')

        expect(input.tagName).toBe('INPUT')
        expect(input).toHaveAttribute('type', 'number')
        view.trigger('submit')
      })
      await modals.prompt({ type: 'number' })
    })

    it('should allow to render a radio group', async () => {
      modals.on('open', () => {
        const view = container.querySelector('bootstrap-modal-prompt')
        const inputs = view.querySelectorAll('.form-group input')
        const labels = view.querySelectorAll('.form-group label')

        expect(inputs.length).toBe(2)
        expect(inputs[0]).toHaveAttribute('type', 'radio')
        expect(inputs[0]).toHaveAttribute('value', 's')
        expect(inputs[0]).not.toHaveAttribute('checked')
        expect(labels[0]).toHaveTextContent('Simplified')
        expect(inputs[1]).toHaveAttribute('type', 'radio')
        expect(inputs[1]).toHaveAttribute('value', 'c')
        expect(inputs[1]).toHaveAttribute('checked')
        expect(labels[1]).toHaveTextContent('Complex')
        view.trigger('submit')
      })
      await modals.prompt({
        value: 'c',
        input: 'radiogroup',
        items: [
          { name: 'Simplified', value: 's' },
          { name: 'Complex', value: 'c' },
        ],
      })
    })

    it('should resolve to selected radio value', async () => {
      modals.on('open', () => {
        const view = container.querySelector('bootstrap-modal-prompt')
        const submitButton = view.querySelector('button[type="submit"]')
        const inputs = view.querySelectorAll('.form-group input')

        inputs[0].checked = true
        submitButton.click()
      })
      const result = await modals.prompt({
        value: 'c',
        input: 'radiogroup',
        items: [
          { name: 'Simplified', value: 's' },
          { name: 'Complex', value: 'c' },
        ],
      })
      expect(result).toBe('s')
    })
  })
})

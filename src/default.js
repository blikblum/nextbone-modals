let DefaultModals
let defaultInstance

export function setDefaultModals(Modals) {
  DefaultModals = Modals
}

// for testing purposes
export function releaseDefaultModals() {
  defaultInstance = undefined
}

export function getModalsService() {
  if (!DefaultModals) {
    throw new Error('Default Modals service is not set')
  }
  if (!defaultInstance) {
    defaultInstance = new DefaultModals()
  }
  return defaultInstance
}

/**
 * @param {import("./service.js").AlertOptions} options
 * @returns {Promise<void>}
 */
export function showAlert(options) {
  return getModalsService().alert(options)
}

/**
 * @param {import("./service.js").ConfirmOptions} options
 * @returns {Promise<boolean>}
 */
export function showConfirm(options) {
  return getModalsService().confirm(options)
}

/**
 * @param {import("./service.js").PromptOptions} [options]
 * @returns {Promise<*>}
 */
export function showPrompt(options) {
  return getModalsService().prompt(options)
}

/**
 * @param {string | HTMLElement} el
 * @param {import("./service.js").DialogOptions} options
 * @returns {Promise<*>}
 */
export function showDialog(el, options) {
  return getModalsService().dialog(el, options)
}

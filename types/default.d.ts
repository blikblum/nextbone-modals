export function setDefaultModals(Modals: any): void;
export function releaseDefaultModals(): void;
export function getModalsService(): any;
/**
 * @param {import("./service.js").AlertOptions} options
 * @returns {Promise<void>}
 */
export function showAlert(options: import("./service.js").AlertOptions): Promise<void>;
/**
 * @param {import("./service.js").ConfirmOptions} options
 * @returns {Promise<boolean>}
 */
export function showConfirm(options: import("./service.js").ConfirmOptions): Promise<boolean>;
/**
 * @param {import("./service.js").PromptOptions} [options]
 * @returns {Promise<*>}
 */
export function showPrompt(options?: import("./service.js").PromptOptions): Promise<any>;
/**
 * @param {string | HTMLElement} el
 * @param {import("./service.js").DialogOptions} options
 * @returns {Promise<*>}
 */
export function showDialog(el: string | HTMLElement, options: import("./service.js").DialogOptions): Promise<any>;
//# sourceMappingURL=default.d.ts.map
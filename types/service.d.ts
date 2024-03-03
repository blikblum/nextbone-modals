/**
 * @typedef AlertOptions
 * @property {string} [title]
 * @property {string} [text]
 * @property {string} [ok]
 *
 * @typedef ConfirmOptions
 * @property {string} [title]
 * @property {string} [text]
 * @property {string} [ok]
 * @property {string} [cancel]
 *
 * @typedef PromptOptions
 * @property {string} [title]
 * @property {*} [value]
 * @property {string} [type]
 * @property {string} [input]
 * @property {{name: string, value: any}[]} [items]
 * @property {string} [ok]
 * @property {string} [cancel]
 *
 * @typedef DialogOptions
 * @property {boolean} [centered]
 * @property {boolean} [scrollable]
 * @property {boolean} [fullscreen]
 * @property {string} [size]
 * @property {string} [customClass]
 * @property {Record<string, any>} [properties]
 */
/**
 * @class Modals
 */
export class Modals extends Events {
    views: any[];
    createElement(type: any): HTMLElement;
    getCancelHandler(view: any): any;
    /**
     * @method open
     * @param {HTMLElement} [view]
     * @returns {Promise}
     */
    open(view?: HTMLElement, options: any): Promise<any>;
    _isOpen: boolean;
    /**
     * @method close
     * @param {HTMLElement} [view]
     * @returns {Promise}
     */
    close(view?: HTMLElement, options: any): Promise<any>;
    /**
     * @method alert
     * @param {AlertOptions} [options]
     * @returns {Promise<void>}
     */
    alert(options?: AlertOptions): Promise<void>;
    /**
     * @method confirm
     * @param {ConfirmOptions} [options]
     * @returns {Promise<boolean>}
     */
    confirm(options?: ConfirmOptions): Promise<boolean>;
    /**
     * @method prompt
     * @param {PromptOptions} [options]
     * @returns {Promise<*>}
     */
    prompt(options?: PromptOptions): Promise<any>;
    /**
     * @param {string | HTMLElement} el
     * @param {DialogOptions} options
     * @returns {Promise<*>}
     */
    dialog(el: string | HTMLElement, options?: DialogOptions): Promise<any>;
    /**
     * @method isOpen
     * @returns {Boolean}
     */
    isOpen(): boolean;
    /**
     * @abstract
     * @method render
     */
    render(): void;
    /**
     * @abstract
     * @method remove
     */
    remove(): void;
    /**
     * @abstract
     * @method animateIn
     */
    animateIn(): void;
    /**
     * @abstract
     * @method animateSwap
     */
    animateSwap(): void;
    /**
     * @abstract
     * @method animateOut
     */
    animateOut(): void;
}
export type AlertOptions = {
    title?: string;
    text?: string;
    ok?: string;
};
export type ConfirmOptions = {
    title?: string;
    text?: string;
    ok?: string;
    cancel?: string;
};
export type PromptOptions = {
    title?: string;
    value?: any;
    type?: string;
    input?: string;
    items?: {
        name: string;
        value: any;
    }[];
    ok?: string;
    cancel?: string;
};
export type DialogOptions = {
    centered?: boolean;
    scrollable?: boolean;
    fullscreen?: boolean;
    size?: string;
    customClass?: string;
    properties?: Record<string, any>;
};
import { Events } from 'nextbone';
//# sourceMappingURL=service.d.ts.map
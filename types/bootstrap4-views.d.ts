export class AlertView extends BaseModal {
    render(data: any): string;
}
export class ConfirmView extends BaseModal {
    render(data: any): string;
}
export class PromptView extends BaseModal {
    getInputValue(): any;
    renderInput({ input, type, value, items, text }: {
        input: any;
        type?: string;
        value: any;
        items?: any[];
        text: any;
    }): string;
    render(data: any): string;
}
export namespace defaultCaptions {
    let ok: string;
    let cancel: string;
    let yes: string;
    let no: string;
}
declare class BaseModal extends HTMLElement {
    confirmClick(): void;
    getInputValue(): string;
    submit(e: any): void;
    bindEvent(selector: any, event: any, listener: any): void;
    connectedCallback(): void;
}
export {};
//# sourceMappingURL=bootstrap4-views.d.ts.map
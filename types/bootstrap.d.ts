export class BootstrapModals extends Modals {
    static setCaptions(captions?: {}): void;
    static setOptions(options?: {}): void;
    setup(options?: {}): void;
    container: any;
    start(): void;
    $layout: any;
    contentRegion: Region;
    __dialogClasses: string;
    render(view: any): void;
    animateIn(): Promise<any>;
    animateOut(): Promise<any>;
}
import { Modals } from './service.js';
import { Region } from 'nextbone/dom-utils';
//# sourceMappingURL=bootstrap.d.ts.map
// Type definitions for jQuery init-tel-input Plug-in
// Definitions by: Adam Rogas <https://github.com/adamrogas>

declare module IntTelInput {
    interface Static extends JQueryStatic {
        (options?: any): IntTelInput;
    }
    interface IntTelInput extends JQuery {
        destroy: () => void;
        reset: () => void;
    }
}

interface JQueryStatic {
    intlTelInput: IntTelInput.Static;
}

interface JQuery {
    intlTelInput: IntTelInput.Static;
}

/** Ambient wrapper so it can be loaded through require. */
declare module 'jqueryUiIntlTelInput'
{
    export = IntTelInput;
}

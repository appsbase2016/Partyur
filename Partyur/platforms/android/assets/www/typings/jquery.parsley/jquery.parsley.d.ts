// Type definitions for jQuery Parsley Validation Plug-in
// Definitions by: Adam Rogas <https://github.com/adamrogas>

declare module Parsley {
    interface Static {
        (form?: string, options?: any): Parsley;
        (options?: any): Parsley;
    }
    interface Parsley {
        destroy: () => void;
        validate: () => boolean;
        asyncValidate: () => JQueryPromise<any>;
        reset: () => void;
    }
}

interface JQueryStatic {
    parsley: Parsley.Static;
}

interface JQuery {
    parsley: Parsley.Static;
}

/** Ambient wrapper so it can be loaded through require. */
declare module 'jqueryUiParsley'
{
    export = Parsley;
}

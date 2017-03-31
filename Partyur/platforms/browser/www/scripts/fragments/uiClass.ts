/// <reference path="../../kendo/typescript/jquery.d.ts" />

interface eventDelegateStruct {
    selector: JQuery;
    eventName: string;
    fn: (e: JQueryEventObject) => any;
}

class uiClass {

    private _eventDelegates: Array<eventDelegateStruct> = [];

    public addEvent(selector, eventName, fn) {

        var _fn = (...e) => {
            //console.log('delegatedEventTrace', selector, eventName, e);
            fn.apply(this, e);
        }

        this._eventDelegates.push({ selector: selector, eventName: eventName, fn: _fn });

        selector.on(eventName, _fn);

    }

    public removeEvent(selector: JQuery, eventName: string, fn: (e: JQueryEventObject) => any) {

        if (fn) {
            selector.off(eventName, fn);
        }
        else {
            selector.off(eventName);
        }

    }

    public destroy() {

        var $this = this;

        this._eventDelegates.forEach(function (e) {

            $this.removeEvent(e.selector, e.eventName, e.fn);

        })
    }
}
module uiClass {
    export function createDelegate(contextObject, method: Function, appendArgs?) {
        return function () {
            var newArgs: Array<any> = appendArgs ? [] : <any>arguments;
            if (appendArgs) {
                for (var i = 0; i < arguments.length; i++) { newArgs.push(arguments[i]); }
                for (var i = 0; i < appendArgs.length; i++) { newArgs.push(appendArgs[i]) }
            }
            return method.apply(contextObject, arguments);
        }
    }
}
export = uiClass;
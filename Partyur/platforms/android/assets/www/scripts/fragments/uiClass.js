/// <reference path="../../kendo/typescript/jquery.d.ts" />
define(["require", "exports"], function (require, exports) {
    var uiClass = (function () {
        function uiClass() {
            this._eventDelegates = [];
        }
        uiClass.prototype.addEvent = function (selector, eventName, fn) {
            var _this = this;
            var _fn = function () {
                var e = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    e[_i - 0] = arguments[_i];
                }
                //console.log('delegatedEventTrace', selector, eventName, e);
                fn.apply(_this, e);
            };
            this._eventDelegates.push({ selector: selector, eventName: eventName, fn: _fn });
            selector.on(eventName, _fn);
        };
        uiClass.prototype.removeEvent = function (selector, eventName, fn) {
            if (fn) {
                selector.off(eventName, fn);
            }
            else {
                selector.off(eventName);
            }
        };
        uiClass.prototype.destroy = function () {
            var $this = this;
            this._eventDelegates.forEach(function (e) {
                $this.removeEvent(e.selector, e.eventName, e.fn);
            });
        };
        return uiClass;
    })();
    var uiClass;
    (function (uiClass) {
        function createDelegate(contextObject, method, appendArgs) {
            return function () {
                var newArgs = appendArgs ? [] : arguments;
                if (appendArgs) {
                    for (var i = 0; i < arguments.length; i++) {
                        newArgs.push(arguments[i]);
                    }
                    for (var i = 0; i < appendArgs.length; i++) {
                        newArgs.push(appendArgs[i]);
                    }
                }
                return method.apply(contextObject, arguments);
            };
        }
        uiClass.createDelegate = createDelegate;
    })(uiClass || (uiClass = {}));
    return uiClass;
});

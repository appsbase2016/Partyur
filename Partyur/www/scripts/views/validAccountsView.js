/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../typings/jquery.parsley/jquery.parsley.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../fragments/baseView', '../fragments/stateManager'], function (require, exports, baseView, __stateManager) {
    var validAccountsView = (function (_super) {
        __extends(validAccountsView, _super);
        function validAccountsView(view) {
            _super.call(this, view);
            this.addEvent($(__stateManager), 'STATE_UPDATE', validAccountsView.createDelegate(this, this.onStateChanged));
        }
        validAccountsView.prototype.onStateChanged = function (data) {
            this.data = null;
            //this.data = new kendo.data.ObservableObject(data);
            //this.data.set('phone', '7029091234');
            //this.data.set('email', 'test@load.com');
        };
        validAccountsView.prototype.getData = function () {
            if (this.view) {
                kendo.bind(this.view.element, this.data);
            }
        };
        validAccountsView.prototype.onChange = function (e) {
            $(e.target).parents('.form-group').addClass('verifying');
            __stateManager.updateEmailAddress($(e.target).val(), undefined, function (err) {
                $(e.target).parents('.form-group').removeClass('verifying');
                $(e.target).parents('.form-group').addClass('verificationSent');
            });
        };
        validAccountsView.prototype.onShow = function (e) {
            _super.prototype.onShow.call(this, e);
            //if (!this.data) {
            this.data = __stateManager.getAccountInfo();
            //            try {
            kendo.bind(this.view.element, this.data);
            //           } catch (ex) {
            //               console.log(ex.message);
            //           }
            //}
            //if (this.data) {
            //    this.getData()
            //}
            if (!this.validator) {
                this.validator = this.view.element.find('form').parsley(window['ParsleyConfig']);
                this.view.element.find('form input').on('change', validAccountsView.createDelegate(this, this.onChange));
                var ellipsis = {
                    'value': ['', '.', '..', '...'],
                    'count': 0,
                    'run': false,
                    'timer': null,
                    'element': '.ellipsis',
                    'start': function () {
                        var t = this;
                        this.run = true;
                        this.timer = setInterval(function () {
                            if (t.run) {
                                $(t.element).css({ minWidth: '10px', display: 'inline-block', textAlign: 'left' }).html(t.value[t.count % t.value.length]).text();
                                t.count++;
                            }
                        }, 250);
                    },
                    'stop': function () {
                        this.run = false;
                        clearInterval(this.timer);
                        this.count = 0;
                    }
                };
                ellipsis.start();
            }
        };
        return validAccountsView;
    })(baseView);
    var validAccountsView;
    (function (validAccountsView) {
        var $me;
        function init(e) {
            $me = new validAccountsView(e.view);
        }
        validAccountsView.init = init;
    })(validAccountsView || (validAccountsView = {}));
    return validAccountsView;
});

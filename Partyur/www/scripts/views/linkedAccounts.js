/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../fragments/baseView', '../fragments/stateManager'], function (require, exports, baseView, __stateManager) {
    var linkedAccounts = (function (_super) {
        __extends(linkedAccounts, _super);
        function linkedAccounts(view) {
            _super.call(this, view);
            this.addEvent($(__stateManager), 'FAVORITES_UPDATE', linkedAccounts.createDelegate(this, this.onStateUpdated));
        }
        linkedAccounts.prototype.onStateUpdated = function (data) {
        };
        return linkedAccounts;
    })(baseView);
    var linkedAccounts;
    (function (linkedAccounts) {
        var $me;
        function init(e) {
            $me = new linkedAccounts(e.view);
        }
        linkedAccounts.init = init;
    })(linkedAccounts || (linkedAccounts = {}));
});

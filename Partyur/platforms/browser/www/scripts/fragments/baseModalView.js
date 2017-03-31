/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './uiClass'], function (require, exports, uiClass) {
    var baseModalView = (function (_super) {
        __extends(baseModalView, _super);
        function baseModalView(view) {
            _super.call(this);
            var $this = this;
            this.view = view;
            this.view.bind('show', baseModalView.createDelegate(this, this.onShow));
            this.view.element.find('[data-dismiss="modal"]').click(baseModalView.createDelegate(this, this.onClose));
        }
        baseModalView.prototype.onClose = function (e) {
            this.close();
        };
        baseModalView.prototype.close = function () {
            this.view.close();
        };
        baseModalView.prototype.onShow = function (e) {
        };
        baseModalView.prototype.show = function (target) {
            this.view.open(target);
        };
        return baseModalView;
    })(uiClass);
    return baseModalView;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './uiClass'], function (require, exports, uiClass) {
    var baseView = (function (_super) {
        __extends(baseView, _super);
        function baseView(view) {
            _super.call(this);
            this.view = view;
            var $this = this;
            this.view.bind('show', baseView.createDelegate(this, this.onShow));
            this.view.bind('beforeShow', baseView.createDelegate(this, this.onBeforeShow));
        }
        baseView.prototype.onBeforeShow = function (e) {
        };
        baseView.prototype.onShow = function (e) {
        };
        return baseView;
    })(uiClass);
    var baseView;
    (function (baseView) {
        var me = null;
        function init(e) {
            me = new baseView(e.sender);
        }
        baseView.init = init;
    })(baseView || (baseView = {}));
    return baseView;
});

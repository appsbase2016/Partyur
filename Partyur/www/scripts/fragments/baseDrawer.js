var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './uiClass'], function (require, exports, uiClass) {
    var baseDrawer = (function (_super) {
        __extends(baseDrawer, _super);
        function baseDrawer(drawer) {
            _super.call(this);
            this.drawer = drawer;
            this.drawer.bind('show', uiClass.createDelegate(this, this.onShow));
        }
        baseDrawer.prototype.show = function () {
            this.drawer.show();
        };
        baseDrawer.prototype.onShow = function (e) {
            //console.log('base show');
        };
        return baseDrawer;
    })(uiClass);
    return baseDrawer;
});

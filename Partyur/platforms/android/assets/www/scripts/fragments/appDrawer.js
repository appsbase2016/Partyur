var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './baseDrawer', 'fragments/admins'], function (require, exports, baseDrawer, __admins) {
    var appDrawer = (function (_super) {
        __extends(appDrawer, _super);
        function appDrawer(drawer) {
            _super.call(this, drawer);
            this.list = null;
            var $this = this;
            this.addEvent($(__admins), 'ADMINS_UPDATE', $this.onAdminsUpdated);
        }
        appDrawer.prototype.onAdminsUpdated = function (e, data) {
            if (data.length > 0) {
                this.drawer.element.addClass('locationAdmin');
            }
            else {
                this.drawer.element.removeClass('locationAdmin');
            }
        };
        appDrawer.prototype.onShow = function (e) {
            _super.prototype.onShow.call(this, e);
            if (!this.list) {
                this.list = this.drawer.element.find('[data-role="listview"]').kendoMobileListView({
                    click: appDrawer.createDelegate(this, this.onItemClick)
                }).data('kendoMobileListView');
            }
        };
        appDrawer.prototype.onItemClick = function (e) {
            //if (e.button) {
            //    __favoritesManager.clearFavorite(e.button.element.attr('data-location-id'));
            //}
            //else
            //{
            //    __favoritesManager.viewFavorite(e.dataItem)
            //}
        };
        return appDrawer;
    })(baseDrawer);
    var appDrawer;
    (function (appDrawer) {
        var me = null;
        function init(e) {
            me = new appDrawer(e.sender);
        }
        appDrawer.init = init;
    })(appDrawer || (appDrawer = {}));
    return appDrawer;
});

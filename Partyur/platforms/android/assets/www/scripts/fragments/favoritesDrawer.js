var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './baseDrawer', 'fragments/favorites'], function (require, exports, baseDrawer, __favoritesManager) {
    var favoritesDrawer = (function (_super) {
        __extends(favoritesDrawer, _super);
        function favoritesDrawer(drawer) {
            _super.call(this, drawer);
            this.list = null;
            var $this = this;
            this.addEvent($(__favoritesManager), 'FAVORITES_UPDATE', $this.onFavoritesUpdated);
        }
        favoritesDrawer.prototype.onFavoritesUpdated = function (e, data) {
            try {
                this.data = new kendo.data.DataSource({ data: data });
                if (this.list)
                    this.list.setDataSource(this.data);
            }
            catch (ex) {
            }
        };
        favoritesDrawer.prototype.onShow = function (e) {
            _super.prototype.onShow.call(this, e);
            if (!this.list) {
                this.list = this.drawer.element.find('[data-role="listview"]').kendoMobileListView({
                    template: $('#favoriteListItem').html(),
                    click: favoritesDrawer.createDelegate(this, this.onItemClick)
                }).data('kendoMobileListView');
                if (this.data) {
                    this.list.setDataSource(this.data);
                }
            }
        };
        favoritesDrawer.prototype.onItemClick = function (e) {
            if (e.button) {
                __favoritesManager.clearFavorite(e.button.element.attr('data-location-id'));
            }
            else {
                __favoritesManager.viewFavorite(e.dataItem);
            }
        };
        return favoritesDrawer;
    })(baseDrawer);
    var favoritesDrawer;
    (function (favoritesDrawer) {
        var me = null;
        function init(e) {
            me = new favoritesDrawer(e.sender);
        }
        favoritesDrawer.init = init;
    })(favoritesDrawer || (favoritesDrawer = {}));
    return favoritesDrawer;
});

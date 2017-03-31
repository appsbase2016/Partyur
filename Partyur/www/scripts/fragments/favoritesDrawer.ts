import baseDrawer = require('./baseDrawer');

import __favoritesManager = require('fragments/favorites');

class favoritesDrawer extends baseDrawer {

    private data: kendo.data.DataSource;

    private list: kendo.mobile.ui.ListView = null;

    constructor(drawer: kendo.mobile.ui.Drawer) {

        super(drawer);

        var $this = this;

        this.addEvent($(__favoritesManager), 'FAVORITES_UPDATE', $this.onFavoritesUpdated);

    }

    public onFavoritesUpdated(e: JQueryEventObject, data) {

        try {

            this.data = new kendo.data.DataSource({ data: data });

            if (this.list)
                this.list.setDataSource(this.data);

        } catch (ex) {

        }
    }

    public onShow(e: kendo.mobile.ui.DrawerShowEvent) {

        super.onShow(e);

        if (!this.list) {
            this.list = this.drawer.element.find('[data-role="listview"]').kendoMobileListView(
                {
                    template: $('#favoriteListItem').html(),
                    click: favoritesDrawer.createDelegate(this, this.onItemClick)
                }
                ).data('kendoMobileListView');
            if (this.data) {
                this.list.setDataSource(this.data);
            }
        }

    }

    private onItemClick(e: kendo.mobile.ui.ListViewClickEvent) {

        if (e.button) {
            __favoritesManager.clearFavorite(e.button.element.attr('data-location-id'));
        }
        else
        {
            __favoritesManager.viewFavorite(e.dataItem)
        }
    }

}

module favoritesDrawer {

    var me: favoritesDrawer = null;

    export function init(e: kendo.mobile.ui.DrawerInitEvent) {
        me = new favoritesDrawer(e.sender);
    }

    //export function updateData(e) {
    //    me['data'].data(e);
    //}

}

export = favoritesDrawer; 
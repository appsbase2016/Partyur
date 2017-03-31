import baseDrawer = require('./baseDrawer');

import __admins = require('fragments/admins');

class appDrawer extends baseDrawer {

    private data: kendo.data.DataSource;

    private list: kendo.mobile.ui.ListView = null;

    constructor(drawer: kendo.mobile.ui.Drawer) {

        super(drawer);

        var $this = this;

        this.addEvent($(__admins), 'ADMINS_UPDATE', $this.onAdminsUpdated);

    }

    public onAdminsUpdated(e: JQueryEventObject, data) {

        if (data.length > 0) {
            this.drawer.element.addClass('locationAdmin');
        } else {
            this.drawer.element.removeClass('locationAdmin');
        }

    }

    public onShow(e: kendo.mobile.ui.DrawerShowEvent) {

        super.onShow(e);

        if (!this.list) {
            this.list = this.drawer.element.find('[data-role="listview"]').kendoMobileListView(
                {
                    click: appDrawer.createDelegate(this, this.onItemClick)
                }
                ).data('kendoMobileListView');
        }

    }

    private onItemClick(e: kendo.mobile.ui.ListViewClickEvent) {

        //if (e.button) {
        //    __favoritesManager.clearFavorite(e.button.element.attr('data-location-id'));
        //}
        //else
        //{
        //    __favoritesManager.viewFavorite(e.dataItem)
        //}

    }

}

module appDrawer {

    var me: appDrawer = null;

    export function init(e: kendo.mobile.ui.DrawerInitEvent) {
        me = new appDrawer(e.sender);
    }

    //export function updateData(e) {
    //    me['data'].data(e);
    //}

}

export = appDrawer; 
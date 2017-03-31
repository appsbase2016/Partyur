/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />

import baseView = require('../fragments/baseView');
import __stateManager = require('../fragments/stateManager');
import __favoritesManager = require('../fragments/favorites');

import xhr = require('../xhr');

class partyFeed extends baseView {


    list: kendo.mobile.ui.ListView;

    data: kendo.data.DataSource;

    personal: Boolean = false;

    constructor(view: kendo.mobile.ui.View) {

        super(view)

        this.personal = view.element[0].id === 'myPosts';

        this.addEvent($(__favoritesManager), 'FAVORITES_UPDATE', partyFeed.createDelegate(this, this.onFavoritesUpdated));


    }

    onFavoritesUpdated(data) {
        this.getData();
    }

    getData() {

        if (this.personal) {
            this.data = this.createDataSource(__stateManager.activeBaseURL() + "/posts/me");
        } else {
            this.data = this.createDataSource(__stateManager.activeBaseURL() + "/posts/feed");
        }

        if (this.list) {
            this.list.setDataSource(this.data);
        }

    }

    createDataSource(url: string, sendToken: boolean = true) {
        try {
            return new kendo.data.DataSource({
                transport: {
                    read: {
                        url: url,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + __stateManager.getToken());
                        }
                    }
                }, error: function (e) {
                    /// This is cheating
                    e.sender.data([]);
                }
            });
        } catch (ex) {
            return null;
        }
    }

    onShow(e: kendo.mobile.ui.ViewShowEvent) {

        if (__stateManager.appViewModel.get('twoColumn')) {
            this.view.element.addClass('twocolumn');
        } else {
            this.view.element.removeClass('twocolumn');
        }

        super.onShow(e);
        var $this = this;
        if (!this.list) {
            this.list = this.view.element.find('[data-role="listview"]').kendoMobileListView({
                template: $('#feedListItem').html(),
                dataBound: function (e) {
                    if (this.dataSource.data().length == 0) {
                        $this.list.element.append($('[data-role="emptylistview"]').html());
                    }
                    else {

                    }
                }
            }).data("kendoMobileListView");
            if (this.data) {
                this.list.setDataSource(new kendo.data.DataSource({ data: this.data }));
            }
            else {
                this.getData();
            }
        }
        else {
            if (this.data) {
                this.data.read();
            }
        }
    }
}

class partyFeedInstance {

    constructor(key: string) {

    }

    private $me: partyFeed;

    public init(e: kendo.mobile.ui.ViewInitEvent) {

        this.$me = new partyFeed(e.view);

    }

}

module partyFeed {

    export function initInstance(key: string) {
        return new partyFeedInstance(key);
    }

}
export = partyFeed
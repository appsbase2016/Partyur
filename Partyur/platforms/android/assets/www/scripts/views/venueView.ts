/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />

import baseView = require('../fragments/baseView');
import __stateManager = require('../fragments/stateManager');
import __favoritesManager = require('../fragments/favorites');

import xhr = require('../xhr');

class venueView extends baseView {


    list: kendo.mobile.ui.ListView;

    data: kendo.data.DataSource;

    pageData: kendo.data.ObservableObject;

    party: boolean = false;

    favBtn: kendo.mobile.ui.Button;

    constructor(view: kendo.mobile.ui.View) {
        super(view)

        this.party = view.element[0].id === "myPartyView";

        this.favBtn = view.element.find('.btn-favorite').data('kendoMobileButton');
        if (this.favBtn) {
            this.favBtn.bind('click', venueView.createDelegate(this, this.onFavorite));
        }
        this.addEvent($(__favoritesManager), 'FAVORITES_UPDATE', venueView.createDelegate(this, this.onFavoritesUpdated));


    }

    onFavoritesUpdated(data) {

        if (__favoritesManager.isFavorite(this.pageData.get('_id'))) {
            this.favBtn.element.removeClass('fa-star-o');
            this.favBtn.element.addClass('fa-star');
        } else {
            this.favBtn.element.removeClass('fa-star');
            this.favBtn.element.addClass('fa-star-o');
        }

    }

    getData() {

        this.data = this.createDataSource(__stateManager.activeBaseURL() + "/posts/" + this.pageData.get('_id'));
        if (this.list) {
            this.list.setDataSource(this.data);
        }

    }

    createDataSource(url: string, sendToken: boolean = true) {
        return new kendo.data.DataSource({
            transport: {
                read: {
                    url: url,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + __stateManager.getToken());
                    }
                }
            }
        });
    }

    onFavorite(e: kendo.mobile.ui.ButtonClickEvent) {

        var id = this.pageData.get('_id');
        var $this = this;

        if (__favoritesManager.isFavorite(id)) {
            __favoritesManager.clearFavorite(id, function (e) {
                if (!e) {
                    $this.favBtn.element.removeClass('fa-star');
                    $this.favBtn.element.addClass('fa-star-o');
                }
            })
        } else {
            __favoritesManager.favorite(id, function (e) {
                if (!e) {
                    $this.favBtn.element.removeClass('fa-star-o');
                    $this.favBtn.element.addClass('fa-star');
                }
            });

        }
    }

    onShow(e: kendo.mobile.ui.ViewShowEvent) {

        super.onShow(e);

        if (__stateManager.appViewModel.get('twoColumn')) {
            this.view.element.addClass('twocolumn');
        } else {
            this.view.element.removeClass('twocolumn');
        }

        var $this = this;

        if (this.party) {
            this.pageData = new kendo.data.ObservableObject(__stateManager.getCurrentLocation());
        } else {
            this.pageData = new kendo.data.ObservableObject(__stateManager.getViewLocation());
        }

        if (this.favBtn) {
            if (__favoritesManager.isFavorite(this.pageData.get('_id'))) {
                this.favBtn.element.removeClass('fa-star-o');
                this.favBtn.element.addClass('fa-star');
            } else {
                this.favBtn.element.removeClass('fa-star');
                this.favBtn.element.addClass('fa-star-o');
            }
        }

        kendo.bind(this.view.element, this.pageData);

        this.data = null;
        //this.view.

        var $this = this;
        if (!this.list) {
            this.list = this.view.element.find('[data-role="listview"]').kendoMobileListView({
                template: $('#feedListItem').html(),
                dataBound: function (e) {
                    if (this.dataSource.data().length == 0) {
                        $this.list.element.append($this.view.element.find('[data-role="emptylistview"]').html());

                        $this.list.element.find(".createPost").on('click', function (e) {

                            __stateManager.createPost(function (e) {

                                __stateManager.cancelCreatePost('#' + $this.view.element['id']);

                            });

                        });

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
            this.getData();
            //if (this.data) {
            //    this.data.read();
            //}
        }
    }
}

class venueViewInstance {

    constructor(key: string) {

    }

    private $me: venueView;

    public init(e: kendo.mobile.ui.ViewInitEvent) {

        this.$me = new venueView(e.view);

    }

}
module venueView {

    export function initInstance(key: string) {
        return new venueViewInstance(key);
    }

}
export = venueView
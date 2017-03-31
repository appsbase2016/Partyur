/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../kendo/typescript/jquery.d.ts" />

import xhr = require('../xhr');

import __stateManager = require('./stateManager');

import uiClass = require('./uiClass');

class favoritesManager extends uiClass {

    constructor() {

        super();
        var $this = this;
        this.addEvent($(__stateManager), 'STATE_UPDATE', $this.onStateUpdate);

    }

    public onStateUpdate(e: JQueryEventObject, state) {

        $(this).triggerHandler('FAVORITES_UPDATE', [state.fav]);

    }

    public viewFavorite(location) {
        __stateManager.viewLocation(location);
    }

    public isFavorite(id: string) {
        if (__stateManager.state.fav) {
            return __stateManager.state.fav.filter(function (item: any) { return item._id === id }).length > 0;
        }
        else {
            return false;
        }
    }

    public favorite(locationId: string, cb?: Function) {

        var $this = this;

        xhr.makeRequest(__stateManager.activeBaseURL() + '/location/favorite', { locationId: locationId }

            , function (e) {

                var modal = $("#favoriteAnimation").data("kendoMobileModalView");

                modal.open(null);

                //modal.element.css()

                modal.element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) { modal.close() });

                modal.element.addClass('animated rubberBand');

                __stateManager.setFavList(e.data);

                $($this).triggerHandler('FAVORITES_UPDATE', [e.data]);

                //__stateManager.setFavList(e);
                if (cb) {
                    cb();
                }
            }, function (e) {

                if (cb) {
                    //// NOT SURE WHAT DO DO ON A FAIL
                    cb(e);
                }
            }, {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: __stateManager.getToken()
            });

        return false;
    }

    public clearFavorite(locationId: string, cb?: Function) {

        //e.preventDefault();
        //(<any>e).stopPropagation();

        var $this = this;

        xhr.makeRequest(__stateManager.activeBaseURL() + '/location/favorite', { locationId: locationId }

            , function (e) {

                __stateManager.setFavList(e.data);

                $($this).triggerHandler('FAVORITES_UPDATE', [e.data]);


                if (cb) {
                    cb();
                }

                //var modal = $("#favoriteAnimation").data("kendoMobileModalView");

                //modal.open(null);

                ////modal.element.css()

                //modal.element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) { modal.close() });

                //modal.element.addClass('animated rubberBand');


            }, function (e) {
                if (cb) {
                    cb(e);
                }
                //// NOT SURE WHAT DO DO ON A FAIL

            }, {
                method: 'DELETE',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: __stateManager.getToken()
            });


        return false;
    }

}

var $fm = new favoritesManager();
export = $fm;
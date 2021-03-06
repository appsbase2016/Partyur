/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../kendo/typescript/jquery.d.ts" />

import xhr = require('../xhr');

import __stateManager = require('./stateManager');

import uiClass = require('./uiClass');

class adminManager extends uiClass {

    currentLocation = null;

    constructor() {

        super();
        var $this = this;
        this.addEvent($(__stateManager), 'STATE_UPDATE', $this.onStateUpdate);

    }

    public onStateUpdate(e: JQueryEventObject, state) {

        $(this).triggerHandler('ADMINS_UPDATE', [state.admin]);

    }

    public viewFavorite(location) {
        __stateManager.viewLocation(location);
    }

    public isAdmin(id: string) {
        if (__stateManager.state.admin) {
            return __stateManager.state.admin.filter(function (item: any) { return item._id === id }).length > 0;
        }
        else {
            return false;
        }
    }

    public setPromo(locationId: string, promo: string, cb?: Function) {
        var $this = this;

        xhr.makeRequest(__stateManager.activeBaseURL() + '/location/promo', { locationId: locationId, promo: promo }

            , function (e) {

                //__stateManager.setAdminList(e.data);

                //$($this).triggerHandler('ADMINS_UPDATE', [e.data]);

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


    public claim(locationId: string, cb?: Function) {

        var $this = this;

        xhr.makeRequest(__stateManager.activeBaseURL() + '/location/admin', { locationId: locationId }

            , function (e) {

                //var modal = $("#favoriteAnimation").data("kendoMobileModalView");

                //modal.open(null);

                ////modal.element.css()

                //modal.element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) { modal.close() });

                //modal.element.addClass('animated rubberBand');
                __stateManager.setAdminList(e.data);

                $($this).triggerHandler('ADMINS_UPDATE', [e.data]);

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

        xhr.makeRequest(__stateManager.activeBaseURL() + '/location/admin', { locationId: locationId }

            , function (e) {

                __stateManager.setFavList(e.data);

                $($this).triggerHandler('ADMINS_UPDATE', [e.data]);


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

var $adm = new adminManager();
export = $adm;
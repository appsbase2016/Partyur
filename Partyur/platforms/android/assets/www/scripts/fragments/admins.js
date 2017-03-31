/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../kendo/typescript/jquery.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../xhr', './stateManager', './uiClass'], function (require, exports, xhr, __stateManager, uiClass) {
    var adminManager = (function (_super) {
        __extends(adminManager, _super);
        function adminManager() {
            _super.call(this);
            this.currentLocation = null;
            var $this = this;
            this.addEvent($(__stateManager), 'STATE_UPDATE', $this.onStateUpdate);
        }
        adminManager.prototype.onStateUpdate = function (e, state) {
            $(this).triggerHandler('ADMINS_UPDATE', [state.admin]);
        };
        adminManager.prototype.viewFavorite = function (location) {
            __stateManager.viewLocation(location);
        };
        adminManager.prototype.isAdmin = function (id) {
            if (__stateManager.state.admin) {
                return __stateManager.state.admin.filter(function (item) { return item._id === id; }).length > 0;
            }
            else {
                return false;
            }
        };
        adminManager.prototype.setPromo = function (locationId, promo, cb) {
            var $this = this;
            xhr.makeRequest(__stateManager.activeBaseURL() + '/location/promo', { locationId: locationId, promo: promo }, function (e) {
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
        };
        adminManager.prototype.claim = function (locationId, cb) {
            var $this = this;
            xhr.makeRequest(__stateManager.activeBaseURL() + '/location/admin', { locationId: locationId }, function (e) {
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
        };
        adminManager.prototype.clearFavorite = function (locationId, cb) {
            //e.preventDefault();
            //(<any>e).stopPropagation();
            var $this = this;
            xhr.makeRequest(__stateManager.activeBaseURL() + '/location/admin', { locationId: locationId }, function (e) {
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
        };
        return adminManager;
    })(uiClass);
    var $adm = new adminManager();
    return $adm;
});

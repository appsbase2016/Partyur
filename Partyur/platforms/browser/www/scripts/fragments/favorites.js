/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../kendo/typescript/jquery.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../xhr', './stateManager', './uiClass'], function (require, exports, xhr, __stateManager, uiClass) {
    var favoritesManager = (function (_super) {
        __extends(favoritesManager, _super);
        function favoritesManager() {
            _super.call(this);
            var $this = this;
            this.addEvent($(__stateManager), 'STATE_UPDATE', $this.onStateUpdate);
        }
        favoritesManager.prototype.onStateUpdate = function (e, state) {
            $(this).triggerHandler('FAVORITES_UPDATE', [state.fav]);
        };
        favoritesManager.prototype.viewFavorite = function (location) {
            __stateManager.viewLocation(location);
        };
        favoritesManager.prototype.isFavorite = function (id) {
            if (__stateManager.state.fav) {
                return __stateManager.state.fav.filter(function (item) { return item._id === id; }).length > 0;
            }
            else {
                return false;
            }
        };
        favoritesManager.prototype.favorite = function (locationId, cb) {
            var $this = this;
            xhr.makeRequest(__stateManager.activeBaseURL() + '/location/favorite', { locationId: locationId }, function (e) {
                var modal = $("#favoriteAnimation").data("kendoMobileModalView");
                modal.open(null);
                //modal.element.css()
                modal.element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) { modal.close(); });
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
        };
        favoritesManager.prototype.clearFavorite = function (locationId, cb) {
            //e.preventDefault();
            //(<any>e).stopPropagation();
            var $this = this;
            xhr.makeRequest(__stateManager.activeBaseURL() + '/location/favorite', { locationId: locationId }, function (e) {
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
        };
        return favoritesManager;
    })(uiClass);
    var $fm = new favoritesManager();
    return $fm;
});

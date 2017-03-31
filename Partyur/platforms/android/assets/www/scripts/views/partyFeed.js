/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../fragments/baseView', '../fragments/stateManager', '../fragments/favorites'], function (require, exports, baseView, __stateManager, __favoritesManager) {
    var partyFeed = (function (_super) {
        __extends(partyFeed, _super);
        function partyFeed(view) {
            _super.call(this, view);
            this.personal = false;
            this.personal = view.element[0].id === 'myPosts';
            this.addEvent($(__favoritesManager), 'FAVORITES_UPDATE', partyFeed.createDelegate(this, this.onFavoritesUpdated));
        }
        partyFeed.prototype.onFavoritesUpdated = function (data) {
            this.getData();
        };
        partyFeed.prototype.getData = function () {
            if (this.personal) {
                this.data = this.createDataSource(__stateManager.activeBaseURL() + "/posts/me");
            }
            else {
                this.data = this.createDataSource(__stateManager.activeBaseURL() + "/posts/feed");
            }
            if (this.list) {
                this.list.setDataSource(this.data);
            }
        };
        partyFeed.prototype.createDataSource = function (url, sendToken) {
            if (sendToken === void 0) { sendToken = true; }
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
            }
            catch (ex) {
                return null;
            }
        };
        partyFeed.prototype.onShow = function (e) {
            if (__stateManager.appViewModel.get('twoColumn')) {
                this.view.element.addClass('twocolumn');
            }
            else {
                this.view.element.removeClass('twocolumn');
            }
            _super.prototype.onShow.call(this, e);
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
        };
        return partyFeed;
    })(baseView);
    var partyFeedInstance = (function () {
        function partyFeedInstance(key) {
        }
        partyFeedInstance.prototype.init = function (e) {
            this.$me = new partyFeed(e.view);
        };
        return partyFeedInstance;
    })();
    var partyFeed;
    (function (partyFeed) {
        function initInstance(key) {
            return new partyFeedInstance(key);
        }
        partyFeed.initInstance = initInstance;
    })(partyFeed || (partyFeed = {}));
    return partyFeed;
});

/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../fragments/baseView', '../fragments/stateManager', '../fragments/favorites'], function (require, exports, baseView, __stateManager, __favoritesManager) {
    var venueView = (function (_super) {
        __extends(venueView, _super);
        function venueView(view) {
            _super.call(this, view);
            this.party = false;
            this.party = view.element[0].id === "myPartyView";
            this.favBtn = view.element.find('.btn-favorite').data('kendoMobileButton');
            if (this.favBtn) {
                this.favBtn.bind('click', venueView.createDelegate(this, this.onFavorite));
            }
            this.addEvent($(__favoritesManager), 'FAVORITES_UPDATE', venueView.createDelegate(this, this.onFavoritesUpdated));
        }
        venueView.prototype.onFavoritesUpdated = function (data) {
            if (__favoritesManager.isFavorite(this.pageData.get('_id'))) {
                this.favBtn.element.removeClass('fa-star-o');
                this.favBtn.element.addClass('fa-star');
            }
            else {
                this.favBtn.element.removeClass('fa-star');
                this.favBtn.element.addClass('fa-star-o');
            }
        };
        venueView.prototype.getData = function () {
            this.data = this.createDataSource(__stateManager.activeBaseURL() + "/posts/" + this.pageData.get('_id'));
            if (this.list) {
                this.list.setDataSource(this.data);
            }
        };
        venueView.prototype.createDataSource = function (url, sendToken) {
            if (sendToken === void 0) { sendToken = true; }
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
        };
        venueView.prototype.onFavorite = function (e) {
            var id = this.pageData.get('_id');
            var $this = this;
            if (__favoritesManager.isFavorite(id)) {
                __favoritesManager.clearFavorite(id, function (e) {
                    if (!e) {
                        $this.favBtn.element.removeClass('fa-star');
                        $this.favBtn.element.addClass('fa-star-o');
                    }
                });
            }
            else {
                __favoritesManager.favorite(id, function (e) {
                    if (!e) {
                        $this.favBtn.element.removeClass('fa-star-o');
                        $this.favBtn.element.addClass('fa-star');
                    }
                });
            }
        };
        venueView.prototype.onShow = function (e) {
            _super.prototype.onShow.call(this, e);
            if (__stateManager.appViewModel.get('twoColumn')) {
                this.view.element.addClass('twocolumn');
            }
            else {
                this.view.element.removeClass('twocolumn');
            }
            var $this = this;
            if (this.party) {
                this.pageData = new kendo.data.ObservableObject(__stateManager.getCurrentLocation());
            }
            else {
                this.pageData = new kendo.data.ObservableObject(__stateManager.getViewLocation());
            }
            if (this.favBtn) {
                if (__favoritesManager.isFavorite(this.pageData.get('_id'))) {
                    this.favBtn.element.removeClass('fa-star-o');
                    this.favBtn.element.addClass('fa-star');
                }
                else {
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
            }
        };
        return venueView;
    })(baseView);
    var venueViewInstance = (function () {
        function venueViewInstance(key) {
        }
        venueViewInstance.prototype.init = function (e) {
            this.$me = new venueView(e.view);
        };
        return venueViewInstance;
    })();
    var venueView;
    (function (venueView) {
        function initInstance(key) {
            return new venueViewInstance(key);
        }
        venueView.initInstance = initInstance;
    })(venueView || (venueView = {}));
    return venueView;
});

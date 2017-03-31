/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './uiClass', '../xhr'], function (require, exports, uiClass, xhr) {
    var stateManager = (function (_super) {
        __extends(stateManager, _super);
        function stateManager() {
            _super.call(this);
            this.map = null;
            this.urls = {
                primary: 'http://api.guudtimes.biz',
                dev: 'http://api-int.guudtimes.biz:8080'
            };
            this.token = null;
            this.state = {
                member: null, currentLocation: null, viewLocation: null, listData: null, uploadResourcePath: null
            };
            this.appViewModel = kendo.observable({
                debug: false,
                distance: 1000,
                twoColumn: true,
                onChange: function (e) {
                    console.log("event :: change (" + (e.checked ? "checked" : "unchecked") + ")");
                }
            });
        }
        stateManager.prototype.associateApp = function (app) {
            this.app = app;
        };
        stateManager.prototype.setMap = function (map) {
            this.map = map;
        };
        stateManager.prototype.navigate = function (path) {
            this.app.navigate(path);
        };
        stateManager.prototype.getPushToken = function () {
            return localStorage.getItem('pushToken');
        };
        stateManager.prototype.setPushToken = function (value) {
            return localStorage.setItem('pushToken', value);
        };
        stateManager.prototype.clearPushToken = function () {
            localStorage.removeItem('pushToken');
        };
        stateManager.prototype.getToken = function () {
            return localStorage.getItem('token');
        };
        stateManager.prototype.setToken = function (value) {
            return localStorage.setItem('token', value);
        };
        stateManager.prototype.clearToken = function () {
            localStorage.removeItem('token');
        };
        stateManager.prototype.setState = function (_state, cb) {
            this.state = _state;
            this.setToken(_state.token);
            if (cb)
                cb(this.state.profile);
            delete this.state.profile;
            $(this).triggerHandler('STATE_UPDATE', [this.state]);
        };
        stateManager.prototype.getVerificationState = function (memberToken) {
            if (memberToken.validated) {
                return 2;
            }
            if (memberToken.validationSent) {
                ///VALIDATON Sent
                return 1;
            }
            ///NOT VALIDATED
            return 0;
        };
        stateManager.prototype.getNearbyLocations = function (cb, coords, distance, limit) {
            if (distance === void 0) { distance = this.appViewModel.get('distance'); }
            if (limit === void 0) { limit = 100; }
            var $this = this;
            try {
                var a = function (loc) {
                    //console.log(loc);
                    xhr.makeRequest($this.activeBaseURL() + '/locations/near', loc, function (e) {
                        /// GOOOD 
                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();
                        if (e.code == 200) {
                            cb(null, loc, e.data);
                        }
                        else {
                            navigator.notification.alert(e.message, function () { console.log('returned from callback'); }, 'Server Notice', 'Ok');
                        }
                    }, function (e) {
                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();
                        navigator.notification.alert('There was an error finding locations near you', function () { console.log('returned from callback'); }, 'Server Error', 'Ok');
                        cb(e, null);
                    }, {
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        token: $this.getToken()
                    });
                };
                if (coords) {
                    a({ latLng: coords, distance: distance, limit: limit });
                }
                else if (window.navigator.simulator === true) {
                    a({ latLng: { lat: 35.98, lng: -115.18 }, distance: distance, limit: limit });
                }
                else {
                    //showMap(null, function () {
                    //    //console.log(arguments);
                    //})
                    //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                    //    (<any>window.plugins).spinnerDialog.show(null, null, true);
                    kendo.mobile.application.showLoading();
                    $this.map.getMyLocation({ enableHighAccuracy: true, timeout: 5000 }, function (loc) {
                        loc.distance = distance;
                        loc.limit = limit;
                        a(loc);
                    }, function (e) {
                        //console.log(e);
                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();
                        navigator.notification.alert('There was an error finding your location', function () { console.log('returned from callback'); }, 'Location Error', 'Ok');
                        cb(e, null);
                    });
                }
            }
            catch (ex) {
            }
        };
        stateManager.prototype.associateDevice = function (token, deviceType, cb) {
            xhr.makeRequest(this.activeBaseURL() + '/member/pushreg', { token: token, deviceType: deviceType }, function (e) {
                cb();
            }, function (e) {
                cb(new Error('There was an error registering for push notifications'));
            }, {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: this.getToken()
            });
        };
        stateManager.prototype.getAccountInfo = function () {
            var email = '', emailVerState = 0, emails = this.state.member.memberTokens.filter(function (item) {
                return item.type === 0;
            });
            if (emails && emails.length) {
                email = emails[0].key;
                emailVerState = this.getVerificationState(emails[0]);
            }
            var phone = '', phoneVerState = 0, phones = this.state.member.memberTokens.filter(function (item) {
                return item.type === 9;
            });
            if (phones && phones.length) {
                phone = phones[0].key;
                phoneVerState = this.getVerificationState(phones[0]);
            }
            var fb = '', fbs = this.state.member.memberTokens.filter(function (item) {
                return item.type === 2;
            });
            if (fbs && fbs.length) {
                fb = fbs[0].key;
            }
            var tw = '', tws = this.state.member.memberTokens.filter(function (item) {
                return item.type === 4;
            });
            if (tws && tws.length) {
                tw = tws[0].key;
            }
            return new kendo.data.ObservableObject({
                email: email,
                emailVerState: emailVerState,
                emailVerStateClass: function () { if (emailVerState == 2) {
                    return 'form-group verified';
                }
                else if (emailVerState == 1) {
                    return 'form-group verificationSent';
                }
                else {
                    return 'form-group';
                } },
                phone: phone,
                phoneVerState: phoneVerState,
                phoneVerStateClass: function () { if (phoneVerState == 2) {
                    return 'form-group verified';
                }
                else if (phoneVerState == 1) {
                    return 'form-group verificationSent';
                }
                else {
                    return 'form-group';
                } },
                facebookId: fb,
                twitter: tw
            });
        };
        stateManager.prototype.clearState = function () {
            this.state = null;
            this.clearToken();
        };
        stateManager.prototype.setAdminList = function (e) {
            this.state.admin = e;
            //favList.data(e);
        };
        stateManager.prototype.setFavList = function (e) {
            this.state.fav = e;
            //favList.data(e);
        };
        stateManager.prototype.clearCurrentLocation = function () {
            this.state.currentLocation = null;
        };
        stateManager.prototype.setClaimLocation = function (location) {
            this.state.claimLocation = location;
        };
        stateManager.prototype.getClaimLocation = function () {
            return this.state.claimLocation;
        };
        stateManager.prototype.viewLocation = function (location) {
            if (location)
                this.setViewLocation(location);
            this.app.navigate('#venueView?id=' + this.state.viewLocation._id);
            $(this).triggerHandler('VIEW_LOCATION', [this.state.viewLocation]);
        };
        stateManager.prototype.currentLocation = function (location) {
            if (location)
                this.setCurrentLocation(location);
            this.app.navigate('#myPartyView?id=' + this.state.currentLocation._id);
            $(this).triggerHandler('VIEW_CURRENT', [this.state.currentLocation]);
        };
        stateManager.prototype.setViewLocation = function (location) {
            this.state.viewLocation = location;
        };
        stateManager.prototype.getViewLocation = function () {
            return this.state.viewLocation;
        };
        stateManager.prototype.getCurrentLocation = function () {
            return this.state.currentLocation;
        };
        stateManager.prototype.setCurrentLocation = function (location) {
            this.state.currentLocation = location;
            $(this).triggerHandler('SET_CURRENT', [this.state.currentLocation]);
        };
        stateManager.prototype.setListData = function (value) {
            this.state.listData = value;
        };
        stateManager.prototype.getListData = function () {
            return this.state.listData;
        };
        stateManager.prototype.cancelCreatePost = function (navId) {
            $(this).triggerHandler('CANCEL_NAV', [navId]);
        };
        stateManager.prototype.createPost = function (cb) {
            $(this).triggerHandler('CREATE_POST', [cb]);
        };
        //public getAuthToken() {
        //    return this.state.member.authCode;
        //}
        stateManager.prototype.sendEmailVerification = function (cb) {
        };
        stateManager.prototype.sendAuthCode = function (cb) {
            xhr.makeRequest(this.activeBaseURL() + '/member/resendActivationCode', undefined, function (e) {
                cb();
            }, function (e) {
                cb(new Error('There was an error sending your AUTH Code'));
            }, {
                method: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: this.getToken()
            });
        };
        stateManager.prototype.updateEmailAddress = function (newAddress, oldAddress, cb) {
            xhr.makeRequest(this.activeBaseURL() + '/member/updateEmailAccount', { newAddress: newAddress, oldAddress: oldAddress }, function (e) {
                cb(e);
            }, function (e) {
                cb(new Error('Invalid Auth Code'));
            }, {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: this.getToken()
            });
        };
        stateManager.prototype.validateAuthCode = function (code, cb) {
            xhr.makeRequest(this.activeBaseURL() + '/member/verify', { authCode: code }, function (e) {
                cb();
            }, function (e) {
                cb(new Error('Invalid Auth Code'));
            }, {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: this.getToken()
            });
        };
        stateManager.prototype.activeBaseURL = function () {
            if (this.appViewModel.get('debug')) {
                return this.urls.dev;
            }
            else {
                return this.urls.primary;
            }
        };
        return stateManager;
    })(uiClass);
    var $sm = new stateManager();
    return $sm;
});

/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />

import __interfaces = require('../interfaces');
import uiClass = require('./uiClass');

import xhr = require('../xhr');

class stateManager extends uiClass {

    map = null;

    urls = {

//        primary: 'http://api.guudtimes.biz',ec2-52-54-174-130.compute-1.amazonaws.com
//        dev: 'http://api-int.guudtimes.biz:8080'
        primary: 'http://ec2-52-54-174-130.compute-1.amazonaws.com'
        dev: 'http://ec2-52-54-174-130.compute-1.amazonaws.com'


    }

    token: string = null;

    state: { member?: any; claimLocation?: __interfaces.Location; currentLocation?: __interfaces.Location; viewLocation?: __interfaces.Location; listData?: any; profile?: any; fav?: Array<Location>; admin?: Array<Location>, uploadResourcePath?: string } = {
        member: null, currentLocation: null, viewLocation: null, listData: null, uploadResourcePath: null
    };

    constructor() {
        super();

    }

    private app: kendo.mobile.Application;

    public appViewModel = kendo.observable({
        debug: false,
        distance: 1000,
        twoColumn: true,
        onChange: function (e) {
            console.log("event :: change (" + (e.checked ? "checked" : "unchecked") + ")");
        }
    });

    public associateApp(app: kendo.mobile.Application) {
        this.app = app;
    }

    public setMap(map) {
        this.map = map;
    }

    public navigate(path: string) {
        this.app.navigate(path);
    }

    public getPushToken() {
        return localStorage.getItem('pushToken');
    }

    public setPushToken(value) {
        return localStorage.setItem('pushToken', value);
    }

    public clearPushToken() {
        localStorage.removeItem('pushToken');
    }


    public getToken() {
        return localStorage.getItem('token');
    }

    public setToken(value) {
        return localStorage.setItem('token', value);
    }

    public clearToken() {
        localStorage.removeItem('token');
    }

    public setState(_state, cb?: (profile) => void) {
        this.state = _state;
        this.setToken(_state.token);
        if (cb)
            cb(this.state.profile);
        delete this.state.profile;

        $(this).triggerHandler('STATE_UPDATE', [this.state]);

    }

    private getVerificationState(memberToken) {

        if (memberToken.validated) {
            return 2;
        }

        if (memberToken.validationSent) {
            ///VALIDATON Sent
            return 1;
        }

        ///NOT VALIDATED
        return 0;


    }

    public getNearbyLocations(cb: Function, coords?: { lat: number; lng: number }, distance: number = this.appViewModel.get('distance'), limit: number = 100) {

        var $this = this;

        try {

            var a = function (loc) {

                //console.log(loc);

                xhr.makeRequest($this.activeBaseURL() + '/locations/near', loc
                    , function (e) {

                        /// GOOOD
                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();

                        if (e.code == 200) {

                            cb(null, loc, e.data);

                        }
                        else {
                            navigator.notification.alert(e.message, function () { console.log('returned from callback') }, 'Server Notice', 'Ok');
                        }


                    }, function (e) {

                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();

                        navigator.notification.alert('There was an error finding locations near you', function () { console.log('returned from callback') }, 'Server Error', 'Ok');

                        cb(e, null);

                    }, {
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        token: $this.getToken()
                    });


            }

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

                    navigator.notification.alert('There was an error finding your location', function () { console.log('returned from callback') }, 'Location Error', 'Ok');

                    cb(e, null);


                });

            }

        } catch (ex) {


        }

    }

    public associateDevice(token: string, deviceType: number, cb: Function) {

        xhr.makeRequest(this.activeBaseURL() + '/member/pushreg', { token: token, deviceType: deviceType }
            , function (e) {

                cb();

            }, function (e) {

                cb(new Error('There was an error registering for push notifications'))

            }, {

                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: this.getToken()

            });

    }

    public getAccountInfo() {

        var email = '', emailVerState = 0, emails = (<Array<any>>this.state.member.memberTokens).filter(function (item) {
            return item.type === 0;
        })
        if (emails && emails.length) {
            email = emails[0].key;
            emailVerState = this.getVerificationState(emails[0])
        }

        var phone = '', phoneVerState = 0, phones = (<Array<any>>this.state.member.memberTokens).filter(function (item) {
            return item.type === 9;
        })
        if (phones && phones.length) {
            phone = phones[0].key;
            phoneVerState = this.getVerificationState(phones[0]);
        }

        var fb = '', fbs = (<Array<any>>this.state.member.memberTokens).filter(function (item) {
            return item.type === 2;
        })
        if (fbs && fbs.length) {
            fb = fbs[0].key;
        }

        var tw = '', tws = (<Array<any>>this.state.member.memberTokens).filter(function (item) {
            return item.type === 4;
        })
        if (tws && tws.length) {
            tw = tws[0].key;
        }

        return new kendo.data.ObservableObject({
            email: email,
            emailVerState: emailVerState,
            emailVerStateClass: function () { if (emailVerState == 2) { return 'form-group verified' } else if (emailVerState == 1) { return 'form-group verificationSent' } else { return 'form-group' } },
            phone: phone,
            phoneVerState: phoneVerState,
            phoneVerStateClass: function () { if (phoneVerState == 2) { return 'form-group verified' } else if (phoneVerState == 1) { return 'form-group verificationSent' } else { return 'form-group' } },
            facebookId: fb,
            twitter: tw
        });

    }

    public clearState() {
        this.state = null;
        this.clearToken();
    }

    public setAdminList(e) {
        this.state.admin = e;
        //favList.data(e);
    }

    public setFavList(e) {
        this.state.fav = e;
        //favList.data(e);
    }

    public clearCurrentLocation() {
        this.state.currentLocation = null;
    }

    public setClaimLocation(location) {
        this.state.claimLocation = location;
    }

    public getClaimLocation() {
        return this.state.claimLocation;
    }

    public viewLocation(location?) {
        if (location)
            this.setViewLocation(location)

        this.app.navigate('#venueView?id=' + this.state.viewLocation._id);
        $(this).triggerHandler('VIEW_LOCATION', [this.state.viewLocation]);
    }

    public currentLocation(location?) {
        if (location)
            this.setCurrentLocation(location)

        this.app.navigate('#myPartyView?id=' + this.state.currentLocation._id);
        $(this).triggerHandler('VIEW_CURRENT', [this.state.currentLocation]);
    }

    public setViewLocation(location) {
        this.state.viewLocation = location;
    }

    public getViewLocation() {
        return this.state.viewLocation;
    }


    public getCurrentLocation() {
        return this.state.currentLocation;
    }

    public setCurrentLocation(location) {
        this.state.currentLocation = location;
        $(this).triggerHandler('SET_CURRENT', [this.state.currentLocation]);
    }
    public setListData(value) {
        this.state.listData = value;
    }

    public getListData() {
        return this.state.listData;
    }

    public cancelCreatePost(navId: string) {
        $(this).triggerHandler('CANCEL_NAV', [navId]);
    }

    public createPost(cb?) {
        $(this).triggerHandler('CREATE_POST', [cb]);
    }

    //public getAuthToken() {
    //    return this.state.member.authCode;
    //}

    public sendEmailVerification(cb: (err?) => void) {

    }

    public sendAuthCode(cb: (err?) => void) {

        xhr.makeRequest(this.activeBaseURL() + '/member/resendActivationCode', undefined
            , function (e) {

                cb();

            }, function (e) {

                cb(new Error('There was an error sending your AUTH Code'))

            }, {
                method: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: this.getToken()
            });

    }

    public updateEmailAddress(newAddress, oldAddress, cb: (err?) => void) {

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


    }

    public validateAuthCode(code, cb: (err?) => void) {

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

    }

    public activeBaseURL() {
        if (this.appViewModel.get('debug')) {
            return this.urls.dev;
        }
        else {
            return this.urls.primary;
        }
    }
}
var $sm = new stateManager();
export = $sm;

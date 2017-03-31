/// <reference path="typings/jquery.intltelinput/jquery.intltelinput.d.ts" />
/// <reference path="../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../kendo/typescript/jquery.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

/// <amd-dependency path= "moment-twitter"  />

//import kendo = require('kendo.mobile.min');  

import _geo = require('fragments/geoLocation');

import xhr = require('./xhr');

import __interfaces = require('./interfaces');

import __stateManager = require('fragments/stateManager');

import __cheers = require('fragments/cheers');

import __favorites = require('fragments/favorites');

import __admins = require('fragments/admins');

import __favoritesDrawer = require('fragments/favoritesDrawer');

import __appDrawer = require('fragments/appDrawer');

import __locationManager = require('fragments/locationManager');

import __selfieView = require('fragments/selfieView');

import __termsView = require('fragments/termsModal');

import __partyFeed = require('views/partyFeed');

import __venueView = require('views/venueView');

import __pushManager = require('fragments/pushManager');

//import __linkedAccounts = require('views/linkedAccounts');

import __validAccountsView = require('views/validAccountsView');

import __moment = require('moment');

var StatusBar = null;  
   
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0 
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an 
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



module Application {

    export var selfieView = __selfieView;

    export var termsView = __termsView;

    export var favoritesDrawer = __favoritesDrawer;

    export var appDrawer = __appDrawer;

    export var locationManager = __locationManager;

    export var partyFeed = __partyFeed.initInstance('partyFeed');

    export var venueView = __venueView.initInstance('venueView');

    export var partyView = __venueView.initInstance('partyView');

    export var myFeed = __partyFeed.initInstance('myFeed');

    //    export var linkedAccounts = __linkedAccounts;

    export var validAccountsView = __validAccountsView;

    export var moment = __moment;

    var app: kendo.mobile.Application;

    var map: any;

    var body: JQuery;

    var geo: _geo.geoLocation;

    var venueList: kendo.mobile.ui.ListView;
    var venueClaimList: kendo.mobile.ui.ListView;
    var searchVenueList: kendo.mobile.ui.ListView;
    var searchVenueListPhotos: kendo.mobile.ui.ListView;
    var searchVenueListPromos: kendo.mobile.ui.ListView;

    var venueListNone: JQuery;
    var partyListNone: JQuery;


    function onProfileChange(e) {
        updateUserProfile(e);
        //console.log("event :: change (" + (e.checked ? "checked" : "unchecked") + ")");
    }

    export var profile: kendo.data.ObservableObject;

    export var appViewModel = __stateManager.appViewModel;

    //export var favorites = __stateManager.favoritesDS;

    //export var venueView = kendo.observable({
    //    venueName: '{venueName}',
    //    locationId: null
    //})

    export var myPartyView = kendo.observable({
        venueName: '{venueName}',
        locationId: null
    })

    export var cameraView = kendo.observable({
        venueName: '{venueName}'
    })

    export var postContent = kendo.observable({

        content: '',

        locationId: -1,

        locationName: undefined,

        mediaType: undefined,

        authorScreenName: undefined,

        authorStatus: undefined,

        authorMood: undefined,

        uploadResourcePath: undefined,

        favDrink: undefined,

        favParty: undefined,

        about: undefined,

        expirePolicy: 1

    });

    /**
     * Helper method needed to bind the model of the view to the header of the layout
     */
    export function showCameraLayout(e: kendo.mobile.ui.LayoutShowEvent) {
        kendo.bind((<any>e.layout).header, (<any>e.view).model);
    }


    export function initialize() {

        (<any>window).APP = {

            models: {
                current:
                {
                    location: null
                },
                home: {
                    title: 'Home'
                },
                settings: {
                    title: 'Settings'
                },
                contacts: {
                    title: 'Contacts',
                    ds: new kendo.data.DataSource({
                        data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }]
                    }),
                    alert: function (e) {
                        alert(e.data.name);
                    }
                }
            }
        };

        document.addEventListener('deviceready', onDeviceReady, false);

        //(<any>kendo.mobile).application.showLoading()

    }

    export function favorite(e: kendo.mobile.ui.ButtonClickEvent) {

        var locationId = e.target.attr('data-location-id');

        if (e.target.hasClass('favorite')) {
            __favorites.clearFavorite(locationId);
            e.target.removeClass('favorite');
        } else {
            __favorites.favorite(locationId);
            e.target.addClass('favorite');
        }

    }

    export function cheers(e: kendo.mobile.ui.ButtonClickEvent) {

        var postId = e.target.attr('data-post-id');
        __cheers.cheers(postId);

    }

    export function favDrawerInit(e: kendo.mobile.ui.DrawerInitEvent) {



    }

    export function handleURL(path: string) {

        var workingPath: string = null;

        if (path.indexOf('fb') == 0) {
            /// LET FACEBOOK DO IT'S THING
        }
        else if (path.indexOf('guudtimes://') == 0) {
            workingPath = path.substr(12);
        }
        console.log('workingPath:' + workingPath);

        var cmd = workingPath.split('/', 2);

        switch (cmd[0].toLowerCase()) {

            case 'auth':
                {
                    validateAuthCode(null, cmd[1].toUpperCase());
                    return;
                }

        }

    }

    function onDeviceReady() {

        //__pushManager.init();

        (<any>kendo.data).binders.toggleClass = kendo.data.Binder.extend({
            init: function (target, bindings, options) {
                kendo.data.Binder.fn.init.call(this, target, bindings, options);

                // get list of class names from our complex binding path object
                this._lookups = [];
                for (var key in this.bindings.toggleClass.path) {
                    this._lookups.push({
                        key: key,
                        path: this.bindings.toggleClass.path[key]
                    });
                }
            },

            refresh: function () {
                var lookup,
                    value;

                for (var i = 0; i < this._lookups.length; i++) {
                    lookup = this._lookups[i];

                    // set the binder's path to the one for this lookup,
                    // because this is what .get() acts on.
                    this.bindings.toggleClass.path = lookup.path;
                    value = this.bindings.toggleClass.get();

                    // add or remove CSS class based on if value is truthy
                    if (value) {
                        $(this.element).addClass(lookup.key);
                    } else {
                        $(this.element).removeClass(lookup.key);
                    }
                }
            }
        });


        var that = this;

        receivedEvent('deviceready');

        //var fbLoginSuccess = function (userData) {
        //    console.log("UserInfo")
        //}

        //facebookConnectPlugin.login(["public_profile"],
        //    fbLoginSuccess,
        //    function (error) { alert("" + error) }
        //    );


        var os = kendo.support.mobileOS, statusBarStyle = "black";

        body = $('body');

        body.addClass('os-' + os.name.toLowerCase()).addClass('os-ver-major-' + os.majorVersion).addClass('os-ver-flat-' + os.flatVersion).addClass('br-' + os.browser.toLowerCase());

        //if ((<any>os).ios && os.flatVersion >= 700) {
        //    //body.height(body.height());
        //    statusBarStyle = "black-translucent";
        //}

        (<any>window).StatusBar.styleBlackTranslucent();
        (<any>window).StatusBar.overlaysWebView(true);
        (<any>window).StatusBar.show();

        document.addEventListener("pause", onPause, false);
        document.addEventListener("resign", onResign, false);
        document.addEventListener("resume", onResume, false);
        document.addEventListener("active", onActive, false);
        document.addEventListener("online", onOnline, false);
        document.addEventListener("offline", onOffline, false);

        window.addEventListener('native.keyboardshow', keyboardShowHandler);

        function keyboardShowHandler(e) {
            //console.log('Keyboard height is: ' + e.keyboardHeight);
            setTimeout(function () { body.addClass('kb-open') }, 10);
        }

        window.addEventListener('native.keyboardhide', keyboardHideHandler);

        function keyboardHideHandler(e) {
            //console.log('Goodnight, sweet prince');
            setTimeout(function () { body.removeClass('kb-open') }, 10);
        }


        app = new kendo.mobile.Application(document.body, {
        
            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            skin: 'flat',//'material-light',
             
            statusBarStyle: statusBarStyle, 

            //useNativeScrolling: true, 

            // the application needs to know which view to load first
            initial: '#landing',

        });

        //(<JQuery>(<any>kendo.mobile).application.pane.loader.element).append($("<span>hi</span>"));

        __stateManager.associateApp(app);
        __stateManager.addEvent($(__stateManager), 'VIEW_LOCATION', viewVenue);
        __stateManager.addEvent($(__stateManager), 'SET_CURRENT', setCurrent);
        __stateManager.addEvent($(__stateManager), 'CREATE_POST', createPost);
        __stateManager.addEvent($(__stateManager), 'CANCEL_NAV', function (e, loc) {
            app.navigate(loc);
        });

        //__admins.addEvent($(__admins), 'ADMINS_UPDATE', function (e) {

        //    if (e.length > 0) {
        //        $("#appDrawer").addClass('locationAdmin');
        //    }
        //    else {
        //        $("#appDrawer").removeClass('locationAdmin');
        //    }

        //});

        geo = new _geo.geoLocation();

        //geo.trackLocation();
        //window.setInterval(function () {
        //    console.log(geo.info);
        //}, 1000)

        //if (!map) {
        //    var div = document.getElementById("map_canvas");
        //    map = (<any>window).plugin.google.maps.Map.getMap(div);
        //    map.on((<any>window).plugin.google.maps.event.MAP_READY, onMapReady);
        //}
        //showMap(null);


        var dataSource = new kendo.data.DataSource({
            data: null,
            schema: {
                model: {
                    fields: {
                        venue: { type: "object" },
                        distance: { type: "number" }
                    }
                }
            }
        });

        //favoritesList = $()

        venueList = $("#venueList").kendoMobileListView({
            dataSource: dataSource,
            template: $('#venueListItem').html(),
        }).data("kendoMobileListView");

        venueClaimList = $("#venueClaimList").kendoMobileListView({
            dataSource: dataSource,
            template: $('#venueListItem').html(),
        }).data("kendoMobileListView");

        searchVenueList = $('#searchVenueList').kendoMobileListView({
            template: $('#searchVenueListItem').html(),
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //$("#myPartyPostNone").show();
                }
                else { 
                    //$("#myPartyPostNone").hide();
                }
            }
        }).data("kendoMobileListView");

        searchVenueListPhotos = $('#searchVenueListPhotos').kendoMobileListView({
            template: $('#feedListItem').html(),
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //$("#myPartyPostNone").show();
                }
                else { 
                    //$("#myPartyPostNone").hide();
                }
            }
        }).data("kendoMobileListView");

        searchVenueListPromos = $('#searchVenueListPromos').kendoMobileListView({
            template: $('#promoListItem').html(),
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //$("#myPartyPostNone").show();
                }
                else { 
                    //$("#myPartyPostNone").hide();
                }
            }
        }).data("kendoMobileListView");


        //myPartyPostList = $("#myPartyPostList").kendoMobileListView({
        //    template: $('#postListItem').html(),
        //    dataBound: function (e) {
        //        if (this.dataSource.data().length == 0) {
        //            $("#myPartyPostNone").show();
        //        }
        //        else {
        //            $("#myPartyPostNone").hide();
        //        }
        //    }
        //}).data("kendoMobileListView");

        //venuePostList = $("#venuePostList").kendoMobileListView({
        //    template: $('#postListItem').html(),
        //    dataBound: function (e) {
        //        if (this.dataSource.data().length == 0) {
        //            $("#venuePostNone").show();
        //        }
        //        else {
        //            $("#venuePostNone").hide();
        //        }
        //    }
        //}).data("kendoMobileListView");


        $('.claimListActive').hide();

        venueListNone = $("#venueListNone");
        venueListNone.show();

        $('.os-ios .topInputs').on('focus', function (e) {
            setTimeout(function () {
                console.log('scroll');
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
            }, 10)
        });


        navigator.splashscreen.hide();

        body.addClass('loaded');


        if (__stateManager.getToken() != null) {
            sendLogin();
        }

        try {
            //alert(cordova.getAppVersion)
            cordova.getAppVersion.getVersionNumber(function (version) {
                $('#versionNumber').text(version);
            });
        } catch (ex) { }

        //$(window).resize(function () {
        //    $('.hsjs').unwrap()
        //    $('.hsjs').css('fontSize', '').css('lineHeight', '');
        //    $().hatchShow();
        //});

        jQuery.fn.hatchShow = function () {
            $('.hsjs').css('display', 'inner-block').css('white-space', 'pre').each(function () {
                var t = $(this);
                //t.parent().is('.hatchshow_temp').unwrap();
                t.wrap("<span class='hatchshow_temp' style='display:block'>");
                var pw = t.parent().width();
                while (t.width() < pw) {
                    t.css('font-size', (t.fontSize() + 1) + "px").css('line-height', (t.fontSize() + 1) + "px"),
                    function () { while (t.width() > pw) { t.css('font-size', (t.fontSize() - .1) + "px") } };
                };
            }).css('visibility', 'visible');
        }

        ; jQuery.fn.fontSize = function () {
            return parseInt($(this).css('font-size').replace('px', ''));
        }

        $().hatchShow();

    }

    var tabStrip: kendo.mobile.ui.TabStrip = null;
    //var mapButton = kendo.mobile.ui.Button;


    //export function manageLocationStats(e: kendo.mobile.ui.ViewInitEvent)
    //{

    //    $("#chart").kendoChart({
    //        title: {
    //            text: "World population by age group and sex"
    //        },
    //        legend: {
    //            visible: false
    //        },
    //        seriesDefaults: {
    //            type: "column"
    //        },
    //        series: [{
    //            name: "0-19",
    //            stack: "Female",
    //            data: [854622, 925844, 984930, 1044982, 1100941, 1139797, 1172929, 1184435, 1184654]
    //        }, {
    //                name: "20-39",
    //                stack: "Female",
    //                data: [490550, 555695, 627763, 718568, 810169, 883051, 942151, 1001395, 1058439]
    //            }, {
    //                name: "40-64",
    //                stack: "Female",
    //                data: [379788, 411217, 447201, 484739, 395533, 435485, 499861, 569114, 655066]
    //            }, {
    //                name: "65-79",
    //                stack: "Female",
    //                data: [97894, 113287, 128808, 137459, 152171, 170262, 191015, 210767, 226956]
    //            }, {
    //                name: "80+",
    //                stack: "Female",
    //                data: [16358, 18576, 24586, 30352, 36724, 42939, 46413, 54984, 66029]
    //            }, {
    //                name: "0-19",
    //                stack: "Male",
    //                data: [900268, 972205, 1031421, 1094547, 1155600, 1202766, 1244870, 1263637, 1268165]
    //            }, {
    //                name: "20-39",
    //                stack: "Male",
    //                data: [509133, 579487, 655494, 749511, 844496, 916479, 973694, 1036548, 1099507]
    //            }, {
    //                name: "40-64",
    //                stack: "Male",
    //                data: [364179, 401396, 440844, 479798, 390590, 430666, 495030, 564169, 646563]
    //            }, {
    //                name: "65-79",
    //                stack: "Male",
    //                data: [74208, 86516, 98956, 107352, 120614, 138868, 158387, 177078, 192156]
    //            }, {
    //                name: "80+",
    //                stack: "Male",
    //                data: [9187, 10752, 13007, 15983, 19442, 23020, 25868, 31462, 39223]
    //            }],
    //        seriesColors: ["#cd1533", "#d43851", "#dc5c71", "#e47f8f", "#eba1ad",
    //            "#009bd7", "#26aadd", "#4db9e3", "#73c8e9", "#99d7ef"],
    //        valueAxis: {
    //            labels: {
    //                template: "#= kendo.format('{0:N0}', value / 1000) # M"
    //            },
    //            line: {
    //                visible: false
    //            }
    //        },
    //        categoryAxis: {
    //            categories: [1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010],
    //            majorGridLines: {
    //                visible: false
    //            }
    //        },
    //        tooltip: {
    //            visible: true,
    //            template: "#= series.stack #s, age #= series.name #"
    //        }
    //    });

    //}

    export function mainLayoutInit(e: kendo.mobile.ui.LayoutInitEvent) {

    }

    export function mainLayoutShow(e: kendo.mobile.ui.LayoutShowEvent) {

        if (tabStrip == null) {

            tabStrip = (<kendo.mobile.ui.TabStrip>e.layout['footer'].find(".main-nav").data("kendoMobileTabStrip"));

        }

        $(e.layout['header'][2]).height(((screen.width / (234 + 8)) * 60) - 8);

        $('#map_canvas').height(e.view['content'].height());

        $('#map_canvas').height(e.view['content'].find('.km-content').height());

        showMap(null, function (e) {


        })

    }

    export function rightDrawer(e: Event) {

        e.preventDefault();
        (<any>e.target).blur();
        $('#rightDrawer').data('kendoMobileDrawer').show();

    }

    function onPause(e) {
        //console.log('pause');
        if (map)
            map.setMyLocationEnabled(false);
    };

    function onResign(e) {
        //console.log('resign');
        if (map)
            map.setMyLocationEnabled(false);
    };

    function onResume(e) {
        //console.log('resume');
        if (map)
            map.setMyLocationEnabled(true);
    };

    function onActive(e) {
        //console.log('active');
    };

    function onOnline(e) {
        //console.log('online');
        if (map)
            map.setMyLocationEnabled(true);
    };

    function onOffline(e) {
        map.setMyLocationEnabled(false);
        //console.log('offline');
    };

    export function navigate(e: Event, viewName: string) {

        e.preventDefault();

        app.navigate($(e.target).attr('href'), null);

    }

    export function openExternalURL(e, url: string) {
        if (device.platform === "Android")
        {
            window.open('http://www.samsung.com/', "_system");
        }
        else if (typeof navigator !== "undefined" && (<any>navigator).app) {
            // Mobile device.
            (<any>navigator).app.loadUrl('http://www.samsung.com/', { openExternal: true });
        } else {
            // Possible web browser
            window.open('http://www.samsung.com/', "_system");
            e
        }
    }


    export function showCurrent() {

    }

    export function topNav(e: kendo.mobile.ui.NavBarEvent) {
        console.log(e.sender);
    }

    export function signupShow(e) {

        $('#signupTel').intlTelInput({

            nationalMode: true,
            utilsScript: "scripts/phone/utilScript.js" // just for formatting/placeholders etc

        });

    }

    export function signup(e, extendedSignup?: { facebookId?: { id: string, token?: string }, twitterId?: { id: string, token?: string }, email?: string }) {

        $('#signup').removeClass('error');
        $('#signup').removeClass('serverError');

        var tel = (<any>$('#signupTel').intlTelInput("getNumber"));
        var pass = $('#signupPass').val();
        var confirmPass = $('#signupPassVer').val();
        var promo = $('#signupPromo').val();

        if (pass != confirmPass && extendedSignup == null) {

            $('#signup').addClass('error');
            return;
        }

        var payload = {
            'phoneNumber': tel,
            'password': pass,
            facebookId: undefined,
            twitterId: undefined,
            email: undefined
        }

        var callback = function () {
            sendLogin(tel, pass);
        }

        if (extendedSignup) {
            payload = {
                phoneNumber: undefined,
                password: undefined,
                facebookId: extendedSignup.facebookId,
                email: extendedSignup.email,
                twitterId: extendedSignup.twitterId
            }
            callback = function () {

                sendLogin(null, null, extendedSignup.facebookId ? extendedSignup.facebookId.id : undefined, extendedSignup.twitterId ? extendedSignup.twitterId.id : undefined, extendedSignup.email);

            }

            //console.log(JSON.stringify(payload));

        }

        // Set spinner dialog fixed (cannot be canceled with screen touch or Android hardware button)
        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
        //    (<any>window.plugins).spinnerDialog.show(null, null, true);

        kendo.mobile.application.showLoading();
         
        xhr.makeRequest(__stateManager.activeBaseURL() + '/member/create', payload
            , function (e) {

                if (e.code == 200) {
                    callback();
                }
                else {

                    $('#signup').addClass('error');
                    navigator.notification.alert('This user is already registered', function () { console.log('returned from callback') }, 'Registration Error', 'Ok');

                }

                //console.log(e);
                //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                //    (<any>window.plugins).spinnerDialog.hide();
                kendo.mobile.application.hideLoading();

            }, function (e) {

                //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                //    (<any>window.plugins).spinnerDialog.hide();
                kendo.mobile.application.hideLoading();

                $('#signup').addClass('serverError');
                //navigator.notification.alert('This user is already registered', function () { console.log('returned from callback') }, 'Registration Error', 'Ok');

            }, {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
            });


    }

    export function loginShow(e) {

        $('#loginTel').intlTelInput({

            nationalMode: true,
            utilsScript: "scripts/phone/utilScript.js" // just for formatting/placeholders etc

        });

    }


    export function fbReturn(data) {

        //setTimeout(function () { console.log(data); }, 0);

        //alert("UserInfo: " + JSON.stringify(data));

        //facebookConnectPlugin.getAccessToken(function (token) {
        //    alert("Token: " + token);
        //}, function (err) {
        //        alert("Could not get access token: " + err);
        //    });

        facebookConnectPlugin.api("/me/?fields=id,email", null,
            function (result) {

                sendLogin(null, null, result.id, null, result.email);

            },
            function (error) {
                alert("Failed: " + error);
            });

    }

    export function fbLogin() {

        //alert(facebookConnectPlugin());
 
        //alert((<any>window).plugins.facebookConnectPlugin);

        facebookConnectPlugin.login(['public_profile', 'email', 'user_friends'], fbReturn, fbReturn);

        //facebookConnectPlugin.getAccessToken(fbReturn, fbReturn);


    }

    function sendLogin(token?, password?, facebookId?, twitterId?, email?) {

        var path = '', payload, options, quite = false;
        var autoSignupOnFail = false;
        if (__stateManager.getToken() != null) {
            path = __stateManager.activeBaseURL() + '/member/loginWithToken';
            payload = undefined;
            options = {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: __stateManager.getToken()
            }
            quite = true;
        }
        else if (facebookId != undefined || twitterId != undefined) {
            autoSignupOnFail = true;
            path = __stateManager.activeBaseURL() + '/member/login';
            payload = {
                'facebookId': facebookId ? { id: facebookId } : undefined,
                'twitterId': twitterId ? { id: twitterId } : undefined,
                'email': email
            };
            options = {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

            }
        }
        else {
            path = __stateManager.activeBaseURL() + '/member/login';
            payload = {
                'phoneNumber': token,
                'password': password
            };
            options = {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',

            }

        }

        // Set spinner dialog fixed (cannot be canceled with screen touch or Android hardware button)
        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
        //    (<any>window.plugins).spinnerDialog.show(null, null, true);
        kendo.mobile.application.showLoading();

        $('#login').removeClass('error');
        $('#login').removeClass('serverError');

        xhr.makeRequest(path, payload
            , function (e) {
                if (e.code == 200) {

                    __stateManager.setState(e.data, function (_profile) {

                        profile = kendo.observable(_profile);

                    });

                    profile.bind('change', onProfileChange);
                    kendo.bind($('#profile'), profile);

                    $('#profile-photo').css('backgroundImage', 'url(' + profile.get('profilePicture') + ')');
                    $('#profile-photo-blur').css('backgroundImage', 'url(' + profile.get('profileBGPicture') + ')');

                    $('#loginTel').val('');
                    $('#loginPass').val('');

                    __pushManager.init();

                    app.navigate('#home');

                }
                else if (e.code == 203) {

                    __stateManager.setState(e.data, function (_profile) {

                        profile = kendo.observable(_profile);

                    });

                    profile.bind('change', onProfileChange);
                    kendo.bind($('#profile'), profile);

                    $('#profile-photo').css('backgroundImage', 'url(' + profile.get('profilePicture') + ')');
                    $('#profile-photo-blur').css('backgroundImage', 'url(' + profile.get('profileBGPicture') + ')');


                    app.navigate('#checkAuthCode');

                }
                else {
                    //$('#login').addClass('error');
                    if (autoSignupOnFail) {

                        signup(null, payload);

                    }
                    else {
                        if (!quite) {
                            navigator.notification.alert('Invalid Account', function () { console.log('returned from callback') }, 'Error', 'Ok');
                        }
                    }
                    __stateManager.clearState()
                }

                //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                //    (<any>window.plugins).spinnerDialog.hide();
                kendo.mobile.application.hideLoading();

            }, function (xhr, staus, e) {

                __stateManager.clearState()

                if (!quite) {
                    //console.log(xhr, staus, e);
                    //$('#login').addClass('error');
                    if (autoSignupOnFail) {

                        signup(null, payload);

                    } else {
                        if (xhr.responseText && xhr.responseText.length > 0) {
                            navigator.notification.alert(JSON.parse(xhr.responseText).message, function () { console.log('returned from callback') }, 'Error', 'Ok');
                        }
                        else {
                            navigator.notification.alert('Server Error: ' + status, function () { console.log('returned from callback') }, 'Error', 'Ok');
                        }
                    }
                }
                //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                //    (<any>window.plugins).spinnerDialog.hide();
                kendo.mobile.application.hideLoading();

            }, options);

    }

    export function updateUserProfile(e) {

        xhr.makeRequest(__stateManager.activeBaseURL() + '/member/updateMemberProfile', { profile: profile }
            , function (e) {

                profile = kendo.observable(e.data.profile);
                profile.bind('change', onProfileChange);
                kendo.bind($('#profile'), profile);

            }, function (e) {



            }, {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: __stateManager.getToken()
            });

    }

    export function validateAuthCode(e, code?: string) {

        kendo.mobile.application.showLoading();

        if (!code) {
            code = (<string>$('#authCode').val()).toUpperCase();
        }

        __stateManager.validateAuthCode(code, function (err) {

            kendo.mobile.application.hideLoading();

            if (err) {

                navigator.notification.alert('Invalid Auth Code', function () { console.log('returned from callback') }, 'Auth Code Error', 'Ok');

                if (__stateManager.getToken() != null) {
                    app.navigate('#checkAuthCode');
                }
                else {
                    app.navigate('#login');
                }


            } else if (__stateManager.getToken() != null) {


                sendLogin();

                //app.navigate('#home');

            }
            else {

                app.navigate('#login');

            }

        });

    }

    export function resend(e) {

        kendo.mobile.application.showLoading();
        __stateManager.sendAuthCode(function (err) {
            kendo.mobile.application.hideLoading();
            if (err) {
                navigator.notification.alert('There was an error sending your AUTH Code', function () { console.log('returned from callback') }, 'Auth Resent', 'Ok');

            } else {
                navigator.notification.alert('You have been resent your AUTH Code', function () { console.log('returned from callback') }, 'Auth Resent', 'Ok');
            }
        });

    }

    export function logout(e: Event) {

        e.preventDefault();

        __stateManager.clearState();

        app.navigate('#landing');
        app.navigate('#home');
        app.navigate('#landing');

    }

    export function login(e: Event) {

        try {

            var tel: string = (<any>$('#loginTel').intlTelInput("getNumber"));
            var pass: string = $('#loginPass').val();

            if (tel.length > 0 && pass.length > 0) {

                sendLogin(tel, pass);

            }
            else {

                navigator.notification.alert('You must enter your phone number and password', function () { console.log('returned from callback') }, 'Login Error', 'Ok');

            }

        }
        catch (ex) {

        }
        e.preventDefault();

    }

    function bindNearbyLocations(navigate?: string, click?: Function) {

        __stateManager.getNearbyLocations(function (err: any, loc, data: Array<any>) {

            __stateManager.setListData(data);

            if (__stateManager.getListData().length == 0) {

                venueListNone.show();
                venueList.element.hide();
                $('.claimListActive').hide();

            }
            else {

                if (click)
                    venueList.one('click', click);

                $('.claimListActive').show();
                venueListNone.hide();
                venueList.element.show();
            }

            venueList.dataSource.data(data);
            //venueClaimList.dataSource.data(data);

            if (navigate)
                app.navigate(navigate);

        });

    }

    $('[data-dismiss="alert"]').on('click', function (e) { $(e.target).parents('.alert').hide() });

    export function confirmClaim(e: kendo.mobile.ui.ButtonEvent) {

        e.sender.element.parent().find('.alert').hide();

        __admins.claim(__stateManager.getClaimLocation()._id.toString(), function (err?) {

            if (err) {

            } else {
                e.sender.element.parent().find('.alert').show();
            }

        })

    }

    export function ensureVerified(e) {
        if (!profile) {
            app.navigate('#landing');
            __stateManager.clearState();
            e.preventDefault();
        }
        if (!profile.get('verified')) {
            app.navigate('#verifyEmail');
            e.preventDefault();
        }
    }

    export function navigateDrawer(e: kendo.mobile.ui.ListViewClickEvent) {

        switch (e.item.index()) {
            case 0: {
                break;
            }
            case 1: {
                break;
            }
            case 2: {
                break;
            }
            case 3: {

                if (profile.get('verified')) {
                    bindNearbyLocations();
                    app.navigate('#add');
                }
                else {
                    app.navigate('#verifyEmail');
                    e.preventDefault();
                }
                break;
            }
            case 4: {
                break;
            }
            case 6:
                {
                    e.preventDefault();
                    logout(<any>e);
                }
        }

    }

    function cameraPostSetup(e: kendo.mobile.ui.ListViewClickEvent) {

        __stateManager.currentLocation(e.dataItem.venue);
        
        //setCurrentLocation(e.dataItem.venue)

        app.navigate('#cameraPicker'); 

    }

    //function setViewLocation(location: Location) {


    //}

     

    function setCurrent(e, location: __interfaces.Location) {

        //    __stateManager.setCurrentLocation(location);

        try {

            postContent.set('locationId', location._id);
            postContent.set('locationName', location.name);

            postContent.set('favDrink', profile.get('drink'));
            postContent.set('about', profile.get('about'));
            postContent.set('favParty', profile.get('party'));
            //postContent.set('expirePolicy', profile.get('expirePolicy'));

            if (profile && profile.get('screenName')) {
                postContent.set('authorScreenName', profile.get('screenName'));
            }

            postContent.set('authorStatus', profile.get('status'));

            postContent.set('authorMood', profile.get('mood'));

            cameraView.set('name', location.name);
            //myPartyView.set('venueName', location.name);

        } catch (err) {

        }
    }
    //    try {
    //        myPartyPostList.setDataSource(createDataSource(__stateManager.activeBaseURL() + "/posts/" + location._id.toString()));

     
    //}


    export function mapNav(e: kendo.mobile.ui.TabStripSelectEvent) {

        $('#map_canvas').removeClass('list').removeClass('photo').removeClass('promo');

        switch (e.item.index()) {
            case 0: /* map */
                {
                    $('#map_canvas').removeClass('active');
                    break;
                }
            case 1: /* list */
                {
                    $('#map_canvas').addClass('active').addClass('list');
                    break;
                }
            case 2: /* photo */
                {
                    $('#map_canvas').addClass('active').addClass('photo');
                    break;
                }
            case 3: /* promos */
                {
                    $('#map_canvas').addClass('active').addClass('promo');
                    break;
                }
        }
    }

    export function createPost(e, cb) {

        if (__stateManager.getCurrentLocation() == null || !checkStillInLocation()) {

            bindNearbyLocations('#whereAreYou', cameraPostSetup);
            return;
        }
        else {
            app.navigate('#cameraPicker');
        }

    }

    export function mainNav(e: kendo.mobile.ui.TabStripSelectEvent) {

        switch (e.item.index()) {
            case 0: /* home */
                {
                    app.navigate("#home");
                    break;
                }
            case 1: /* search */
                {
                    app.navigate("#searchMap");
                    break;
                }
            case 2: /* camera */
                {
                    createPost(e, function (e) {

                        app.navigate("#home");

                    });
                    break;
                }
            case 3: /* my party */
                {

                    if (__stateManager.getCurrentLocation() == null || !checkStillInLocation()) {

                        bindNearbyLocations('#whereAreYou', function (e: kendo.mobile.ui.ListViewClickEvent) {


                            __stateManager.currentLocation(e.dataItem.venue);

                            //setCurrentLocation();

                            //app.navigate('#myPartyView?' + (<any>__stateManager.getCurrentLocation())._id);

                        });
                        return;
                    }
                    else {

                        __stateManager.currentLocation();
                        //app.navigate('#myPartyView?' + __stateManager.getCurrentLocation()._id);

                    }
                   
                    //if (amICheckedIn((<any>e))) {
                    //    app.navigate("#current");
                    //}
                    //else {
                    //    app.navigate("#whereAreYou");
                    //}
                    break;
                }

        }


    }

    function createDataSource(url: string, sendToken: boolean = true) {
        return new kendo.data.DataSource({
            transport: {
                read: <any>{
                    url: url,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + __stateManager.getToken());
                    }
                }
            }
        });
    }

    export function amICheckedIn(e: Event) {



    }

    export function cancelCamera(e: Event) {

        app.navigate("#home");

    }

    export function switchCurrentLocation() {

        __stateManager.clearCurrentLocation();

        bindNearbyLocations('#whereAreYou', function (e: kendo.mobile.ui.ListViewClickEvent) {

            __stateManager.currentLocation(e.dataItem.venue)

        });

    }

    export function clearCurrentLocation() {

        __stateManager.clearCurrentLocation();

        bindNearbyLocations('#whereAreYou', cameraPostSetup);

    }

    //data-icon="toprated"

    export function claimLocation(data) {

        $('[data-dismiss="alert"]').parents('.alert').hide();

        var id = data.item.find('a').attr('data-id');

        var item = __stateManager.getListData().filter(function (item) { return item.venue._id == id })[0];

        __stateManager.setClaimLocation(item.venue);
        //state.viewLocation = item.venue;

        app.navigate('#confirmClaim');

        //$('#cameraVenueName').text(item.venue.name);

    }

    export function selectLocation(data) {

        //var id = data.item.find('a').attr('data-id');

        //var item = state.listData.filter(function (item) { return item.venue._id == id })[0];

        //state.currentLocation = item.venue;
        //state.viewLocation = item.venue;

        //app.navigate('#cameraPicker');

        //$('#cameraVenueName').text(item.venue.name);

    }

    export function checkStillInLocation() {

        //showMap(null, function () {

        //    //console.log(arguments);


        //})

        //// DO RADIUS CHECK TO SEE IF WE ARE STILL IN THE SAME PLACE
        if (__stateManager.getCurrentLocation() && true) {

            return true;

        }
        return false;

    }


    export function getLocationsInBounds(bounds: any, search: string, cb: Function) {

        try {

            var a = function (bounds) {

                //console.log(bounds);

                xhr.makeRequest(__stateManager.activeBaseURL() + '/locations/within', { bounds: bounds, search: search }
                    , function (e) {

                        /// GOOOD 
                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();

                        if (e.code == 200) {
                            cb(null, bounds, e.data);
                        }
                        else {
                            cb(new Error(e.message), bounds, e.data);
                            //navigator.notification.alert(e.message, function () { console.log('returned from callback') }, 'Server Notice', 'Ok');
                        }


                    }, function (e) {

                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();

                        //navigator.notification.alert('There was an error finding locations within the boundary of the map', function () { console.log('returned from callback') }, 'Server Error', 'Ok');

                        cb(e);

                    }, {
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        token: __stateManager.getToken()
                    });


            }

            a(bounds);

        } catch (ex) {


        }

    }



    export function showVenueView(e: Event) {

        if (__stateManager.getCurrentLocation()) {
            $('#venueViewName').text(__stateManager.getCurrentLocation().name);
        }

        if (__stateManager.getViewLocation()) {
            $('#venueViewName').text(__stateManager.getViewLocation().name);
        }

    }

    function uploadPhoto(fileType: string = 'image/jpg', cb?: Function, postContent?: any) {

        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
        //    (<any>window.plugins).spinnerDialog.show(null, null, true);
        kendo.mobile.application.showLoading();


        var imageURI = postContent.get('uploadResourcePath');

        var dataObject = null;
        var post = false;
        switch (postContent.get('type')) {
            case "profile":
                {
                    dataObject = { profile: postContent };
                    break;
                }
            case "post":
                {
                    dataObject = { post: postContent, tz: new Date().getTimezoneOffset() };
                    post = true;
                    break;
                }
        }

        xhr.makeRequest(__stateManager.activeBaseURL() + '/post/postAndSign', dataObject
            , function (e) {
                var data = e.data;
                //console.log(e);
                var options = {
                    params: {
                        "key": data.fileName,
                        "AWSAccessKeyId": data.awsKey,
                        "acl": "public-read",
                        "policy": data.policy,
                        "signature": data.signature,
                        "Content-Type": fileType
                    },
                    chunkedMode: false,
                    headers: {
                        connection: 'close'
                    }

                };

                if (navigator.simulator) {
                    delete options.headers;
                }

                var ft = new FileTransfer();
                ft.upload(imageURI, "https://" + data.bucket + ".s3.amazonaws.com/",

                    function (e) {

                        if (post) {

                            //POST UPLOAD

                            xhr.makeRequest(__stateManager.activeBaseURL() + '/post/confirm/' + data.postId, undefined, function (e) {

                                //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                                //    (<any>window.plugins).spinnerDialog.hide();
                                kendo.mobile.application.hideLoading();

                                postContent.set('content', '');

                                if (cb) {
                                    cb(null, data);
                                }

                            }, function (e) {

                                //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                                //    (<any>window.plugins).spinnerDialog.hide();
                                kendo.mobile.application.hideLoading();

                                navigator.notification.alert('There was an error making this post ', function () { console.log('returned from callback') }, 'Server Error', 'Ok');


                            }, {
                                    method: 'GET',
                                    //dataType: 'json',
                                    //contentType: 'application/json; charset=utf-8',
                                    token: __stateManager.getToken()
                                });
                        }
                        else {

                            //PROFILE UPLOAD

                            kendo.mobile.application.hideLoading();

                            if (cb) {
                                cb(null, data);
                            }

                        }

                    },
                    function (e) {

                        //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                        //    (<any>window.plugins).spinnerDialog.hide();
                        kendo.mobile.application.hideLoading();

                        navigator.notification.alert('There was an error making this post ', function () { console.log('returned from callback') }, 'Server Error', 'Ok');


                    }, <any>options, true);

            }, function (e) {


                //if ((<any>window.plugins) && (<any>window.plugins).spinnerDialog)
                //    (<any>window.plugins).spinnerDialog.hide();
                kendo.mobile.application.hideLoading();

                navigator.notification.alert('There was an error making this post ', function () { console.log('returned from callback') }, 'Server Error', 'Ok');


            }, {
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                token: __stateManager.getToken()
            });


    }

    export function postPost(e: Event) {

        try {

            setTimeout(function () {

                uploadPhoto(undefined, function (e?, data?) {

                    try {
                        __stateManager.currentLocation();
                        tabStrip.switchTo(3);
                    }
                    catch (ex) {

                    }
                    //app.navigate('#myPartyView?' + __stateManager.getCurrentLocation()._id);


                }, postContent);
            }, 500);
        }
        catch (ex) { }

    }

    export function file(e: Event) {

        navigator.camera.getPicture(function (data: string) {

            app.navigate('#cameraPost');

            var a = $('#preview');

            a.height(a.parents('.km-content').height());

            a.css('backgroundImage', 'url(' + data + ')');

            postContent.set('mediaType', 1);

            postContent.set('uploadResourcePath', data);

        }, function (message: string) { }, { correctOrientation: true, targetWidth: 640, targetHeight: 640, encodingType: 0, saveToPhotoAlbum: false, sourceType: 0 });

    }

    export function profilePicture(e: Event) {

        navigator.camera.getPicture(function (data: string) {

            try {

                setTimeout(function () {

                    var profile = new kendo.data.ObservableObject({});

                    profile.set('uploadResourcePath', data);
                    profile.set('type', 'profile');

                    uploadPhoto(undefined, function (e?, retData?) {

                        console.log(e);
                        console.log(retData);

                        $('#profile-photo').css('backgroundImage', 'url(' + data + ')');
                        $('#profile-photo-blur').css('backgroundImage', 'url(' + data + ')');

                    }, profile);

                }, 500);

            }
            catch (ex) { }

        }, function (message: string) { }, { correctOrientation: true, targetWidth: 640, targetHeight: 640, encodingType: 0, saveToPhotoAlbum: false });

    }

    export function camera(e: Event) {

        navigator.camera.getPicture(function (data: string) {

            app.navigate('#cameraPost');

            var a = $('#preview');

            a.height(a.parents('.km-content').height());

            a.css('backgroundImage', 'url(' + data + ')');

            postContent.set('mediaType', 1);

            postContent.set('uploadResourcePath', data);

            postContent.set('type', 'post');


        }, function (message: string) { }, { correctOrientation: true, targetWidth: 640, targetHeight: 640, encodingType: 0, saveToPhotoAlbum: false });

    }

    export function video(e: Event) {

        e.preventDefault();

        setTimeout(function () {

            (<any>window).plugins.videocaptureplus.captureVideo(

                function (mediaFiles) {

                    var i, len;
                    for (i = 0, len = mediaFiles.length; i < len; i++) {
                        var mediaFile = mediaFiles[i];

                        console.log(mediaFile);

                        app.navigate('#cameraPost');

                        postContent.set('uploadResourcePath', mediaFile.fullPath);

                        var options =

                            (<any>window).sebible.videosnapshot.snapshot(function (ss) {

                                if (ss && ss.result) {

                                    for (var i in ss.snapshots) {
                                        var absfilepath = ss.snapshots[1];

                                        var a = $('#preview');

                                        a.height(a.parents('.km-content').height());

                                        a.css('backgroundImage', 'url(' + absfilepath + ')');
                                        return;
                                    }
                                }
                            }, function (e) { }, {
                                    source: mediaFile.fullPath,
                                    count: 3,
                                    //timeStamp: true
                                });
                        //mediaFile.getFormatData(getFormatDataSuccess, getFormatDataError);

                        //var vid = <any>document.createElement('video');
                        //vid.id = "theVideo";
                        //vid.width = "240";
                        //vid.height = "160";
                        //vid.controls = "controls";
                        //$(vid).attr('webkit-playsinline', 'webkit-playsinline');
                        //$(vid).attr('autoplay', 'autoplay');
                        //$(vid).attr('loop', 'loop');

                        //var source_vid = <any>document.createElement('source');
                        //source_vid.id = "theSource";
                        //source_vid.src = mediaFile.fullPath;
                        //vid.appendChild(source_vid);
                        //document.getElementById('video_container').innerHTML = '';
                        //document.getElementById('video_container').appendChild(vid);
                        //document.getElementById('video_meta_container2').innerHTML = parseInt(mediaFile.size / 1000) + 'KB ' + mediaFile.type;
                    }


                }, // your success callback
                function (e) { },   // your error callback
                {
                    limit: 1, // the nr of videos to record, default 1 (on iOS always 1)
                    duration: 6, // max duration in seconds, default 0, which is 'forever'
                    highquality: true, // set to true to override the default low quality setting
                    frontcamera: false, // set to true to override the default backfacing camera setting. iOS: works fine, Android: YMMV (#18)
                    // you'll want to sniff the useragent/device and pass the best overlay based on that.. assuming iphone here
                    portraitOverlay: 'www/img/overlay-iPhone-portrait.png', // put the png in your www folder
                    landscapeOverlay: 'www/img/overlay-iPhone-landscape.png', // not passing an overlay means no image is shown for the landscape orientation
                    //overlayText: 'Please rotate to landscape for the best result' // iOS only
                });
        }, 50);

    }

    export function checkIn(e: Event) {



    }

    export function hideMap(e: Event) {

        //map

    }

    function onMyPositionChange() {
        //Wait
        setTimeout(function () {
            //Get Location  
            map.getMyLocation({ enableHighAccuracy: true, timeout: 5000 }, function (loc) {

                /// This is a bit of a hack but oh well
                //console.log(loc);

                //setTimeout(function () {

                //map.setCenter(loc.latLng);

                //map.showDialog();

                setTimeout(function () {

                    //map.setZoom(14);

                    var a = new CameraPosition({ target: loc.latLng, zoom: 13.0, duration: 1500 })

                    map.animateCamera(a, function (e) { });


                }, 500);

                //}, 10);

            }, function (e) {

                //console.log(e);

            });

        }, 10);

    }

    var markers = {};
    //var newMarkers = {};

    function updateResultsBadge(cb?: Function) {
        clearTimeout(markerUpdateTimer);
        markerUpdateTimer = setTimeout(function () {
            if (Object.keys(markers).length >= 50) {
                tabStrip.badge(1, '50+');
            }
            else {
                tabStrip.badge(1, Object.keys(markers).length.toString());
            }
            if (cb) {
                cb(Object.keys(markers).length);
            }

            //console.log('list data', __stateManager.getListData());

            //searchVenueList.setDataSource(new kendo.data.DataSource({
            //    data: markers 
            //}))


        }, 500);
    }

    export function mapFilterChange(e) {

        try {
            (<any>cordova).plugins.Keyboard.close();
        }
        catch (ex) { }

        try {
            (<any>window).plugins.Keyboard.close();
        }
        catch (ex) { }

        if (lastPosition) {

            map.clear()
            markers = [];

            updateMapOnDrag(lastPosition, function () {

                var bounds = new (<any>window).plugin.google.maps.LatLngBounds();
                var boundsTest = [];
                var keys = Object.keys(markers);

                keys.forEach(function (key, pos, ar) {

                    var marker = markers[key];

                    bounds.extend(new (<any>window).plugin.google.maps.LatLng((<any>marker).location.loc.coordinates[1], (<any>marker).location.loc.coordinates[0]));
                    boundsTest.push(new (<any>window).plugin.google.maps.LatLng((<any>marker).location.loc.coordinates[1], (<any>marker).location.loc.coordinates[0]));
                })

                console.log(bounds);

                if (keys.length === 1) {

                    var a = new CameraPosition({ target: bounds.getCenter(), zoom: 16.0, duration: 2500 })

                    map.animateCamera(a, function (e) {

                    });


                }
                else {

                    var a = new CameraPosition({ target: [bounds.southwest, bounds.northeast], zoom: 10.0, duration: 2500 })

                    map.animateCamera(a, function (e) {

                    });
                }

            });

        }

    }

    var CameraPosition = function (params) {
        var self = this;
        self.zoom = params.zoom;
        self.tilt = params.tilt;
        self.target = params.target;
        self.bearing = params.bearing;
        self.hashCode = params.hashCode;
        self.duration = params.duration;
    };

    export function searchListSelect(e: kendo.mobile.ui.ListViewClickEvent) {

        e.preventDefault()

        if (e.button) {
            var parent = e.button.element;

            if (parent.length > 0) {

                var locationId = parent.attr('data-location-id');

                if (parent.hasClass('favorite')) {

                    __favorites.clearFavorite(locationId, function (e) {
                        if (e) { } else {
                            parent.removeClass('favorite');

                            parent.find('i').removeClass('fa-star');
                            parent.find('i').addClass('fa-star-o');
                        }
                    });
                } else {

                    __favorites.favorite(locationId, function (e) {
                        if (e) { } else {
                            parent.addClass('favorite');

                            parent.find('i').addClass('fa-star');
                            parent.find('i').removeClass('fa-star-o');
                        }
                    });
                }
            }
        }
        else {
            __stateManager.viewLocation(e.dataItem);
        }

        //var parent = e.target.parents('[data-location-id]').andSelf('[data-location-id]');


    }

    var markerUpdateTimer = null;
    function updateMapOnDrag(bounds, completed?: Function) {

        map.getVisibleRegion(function (bounds) {


            lastPosition = bounds;
            //console.log(bounds);
             
            var searchBoxText = $('.searchText').val();

            getLocationsInBounds({ 0: bounds[0], 1: bounds[1], center: bounds.getCenter() }, searchBoxText, function (e, bounds, data) {

                if (e) {
                    return;
                }
                //console.log(bounds, data);

                var promos = [];
                var places = [];
                var posts = [];

                //console.log('position', JSON.stringify(position));
                var newMarkers = {};
                if (data) {


                    if (data.length === 0 && map && map.reset) {
                        map.reset();
                    }

                    if (data['places']) {
                        places = data['places'];
                    }

                    if (data['posts']) {
                        posts = data['posts'];
                    }

                    if (data['promos']) {
                        promos = data['promos'];
                    }


                    searchVenueList.setDataSource(new kendo.data.DataSource({
                        data: places
                    }))

                    searchVenueListPhotos.setDataSource(new kendo.data.DataSource({
                        data: posts
                    }))

                    searchVenueListPromos.setDataSource(new kendo.data.DataSource({
                        data: promos
                    }))

                    var list = $("#searchList").data("kendoMobileScroller");
                    if (list) {
                        list.reset();
                    }

                    var photoList = $("#searchListPhotos").data("kendoMobileScroller");
                    if (photoList) {
                        photoList.reset();
                    }

                    var promoList = $("#searchListPromos").data("kendoMobileScroller");
                    if (promoList) {
                        promoList.reset();
                    }


                    if (__stateManager.appViewModel.get('twoColumn')) {
                        $('#searchMap').addClass('twocolumn');
                    } else {
                        $('#searchMap').removeClass('twocolumn');
                    }


                    //console.log(data.length);

                    //newMarkers = {};

                    places.forEach(function (obj, key, ar) {

                        newMarkers['id-' + obj._id] = {};

                    });

                    //console.log(Object.keys(newMarkers).length);

                    try {

                        Object.keys(markers).forEach(function (key) {

                            //console.log(key);
                            if (newMarkers[key] == undefined) {

                                //console.log('remove:' + key);

                                markers[key].remove(function () {

                                    //console.log('removed:' + key);

                                    delete markers[key];
                                    updateResultsBadge(completed);

                                });

                            }
                        })

                    } catch (ex) {
                        console.log(ex);
                    }

                    //console.log("marker length:" + Object.keys(markers).length);


                    //var data = state.listData;
                    ///markers = {};

                    places.forEach(function (location) {

                        //markers[]

                        //console.log(location);

                        try {

                            if (markers['id-' + location._id] == null) {

                                map.addMarker({
                                    'position': new (<any>window).plugin.google.maps.LatLng(location.loc.coordinates[1], location.loc.coordinates[0]),
                                    'title': location.name,
                                    'icon': '#ff6917',
                                    'markerClick': function (marker) {

                                        marker.showInfoWindow();

                                    },
                                    'infoClick': function (marker) {
                                        //marker.remove();
                                        __stateManager.viewLocation(location);

                                    }
                                    //'animation': (<any>window).plugin.google.maps.Animation.DROP
                                }, function (marker) {

                                    marker['location'] = location;
                                    markers['id-' + location._id] = marker;
                                    updateResultsBadge(completed);

                                });

                            }
                        } catch (ex) {

                        }

                    })
                }
                else {

                    Object.keys(markers).forEach(function (key) {

                        markers[key].remove(function () {
                            delete markers[key];
                            updateResultsBadge(completed);
                        });

                    })
                    //tabStrip.badge(1, Object.keys(markers).length.toString());

                }

            });

        });


    }

    function viewVenue(e, location) {

        //__stateManager.setViewLocation(location);

        //venueView.set('venueName', location.name);
        //venueView.set('locationId', location._id);

        //try {

        //    venuePostList.setDataSource(createDataSource(__stateManager.activeBaseURL() + "/posts/" + location._id.toString()));

        //}
        //catch (ex) {

        //}

        //app.navigate('#venueView');

    }

    var mdto = null;
    var lastPosition = null
    function onMapCameraChanged(position) {

        //var map = this;
        clearTimeout(mdto);
        mdto = setTimeout(updateMapOnDrag, 500, position);
        lastPosition = position;
    }

    function onMapReady() {

        console.log('map ready');

        //map.setCenter(new (<any>window).plugin.google.maps.LatLng(33.214179, -111.86760));

        /// Look here for possible solution
        //http://www.codeitive.com/0NmjkVgVgq/android-google-map-v2-mapsetmylocationenabledtrue.html
        //try {
        //    //map.setDebugable(true);
        //} catch (ex) {
        //    console.log('does not support debug');
        //}

        try {
            map.enableHighAccuracy(true);
        }
        catch (ex) {
            console.log('does not support High Accuracy');
        }

        map.setMyLocationEnabled(true);

        setTimeout(function () {

            onMyPositionChange();

        }, 200);

    }

    export function showMap(e: Event, cb?) {

        try {
            if (!map) {

                //app.navigate('#searchMap');
                //app.navigate('#home');

                var mc = $('#map_canvas');

                $('.searchText').on('change', mapFilterChange);
                $('.fa-search').parent().click(mapFilterChange);

                //console.log(mc);

                /* THIS IS A HACK WE NEED TO FIX THIS */
                //mc.height(Math.max.apply(Math, $(".km-content").map(function () { return $(this).height(); })));

                var div = mc[0];

                map = (<any>window).plugin.google.maps.Map.getMap(div, {
                    'backgroundColor': '#ffffff',
                    'center': new (<any>window).plugin.google.maps.LatLng(33.214179, -111.86760),
                    'zoom': 15,
                    'mapTypeId': (<any>window).plugin.google.maps.MapTypeId.ROADMAP
                });

                __stateManager.setMap(map);

                map.on((<any>window).plugin.google.maps.event.MAP_READY, onMapReady);

                if (cb) {
                    map.on((<any>window).plugin.google.maps.event.MAP_READY, cb);
                }

                /// THIS EVENT ONLY FIRES ON ANDROID FOR SOME UNKNOWN REASON
                map.on((<any>window).plugin.google.maps.event.MY_LOCATION_CHANGE, onMyPositionChange)


                map.on((<any>window).plugin.google.maps.event.CAMERA_CHANGE, onMapCameraChanged);

            }
            else {
                map.refreshLayout();
            }
        }
        catch (ex) {

            console.log('map did not load');

        }

    }

    function receivedEvent(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
}
export = Application;

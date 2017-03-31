/// <reference path="../typings/cordova/plugins/Media.d.ts" />
/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../kendo/typescript/jquery.d.ts" />
/// <reference path="../typings/cordova/plugins/Push.d.ts" />
/// <reference path="../typings/cordova/plugins/Device.d.ts" />

import xhr = require('../xhr');
import baseView = require('../fragments/baseView');
import __stateManager = require('./stateManager');

import uiClass = require('./uiClass');

class pushManager extends uiClass {

    pushNotification: PushNotification;

    public init() {

        try {
            this.pushNotification = window.plugins.pushNotification;

            window['onNotification'] = pushManager.createDelegate(this, this.onNotification);
            window['onNotificationAPN'] = pushManager.createDelegate(this, this.onNotificationAPN);

            if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
                this.pushNotification.register(
                    pushManager.createDelegate(this, this.successHandler),
                    pushManager.createDelegate(this, this.errorHandler),
                    {
                        "senderID": "247228313708",
                        "ecb": "onNotification"
                    });
            } else {
                this.pushNotification.register(
                    pushManager.createDelegate(this, this.registerToken),
                    pushManager.createDelegate(this, this.errorHandler),
                    {
                        "badge": true,
                        "sound": true,
                        "alert": true,
                        "ecb": "onNotificationAPN"
                    });
            }
        } catch (ex) {

        }

    }

    registerToken(token: string) {

        var cb = function () {

        }

        if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
            __stateManager.associateDevice(token, 1, cb);
        } else {
            __stateManager.associateDevice(token, 0, cb);
        }

    }

    // result contains any message sent from the plugin call
    successHandler(result) {

        /// THIS IS FAIRLY USELESS
        //alert('result = ' + result);

    }

    errorHandler(error) {

        /// THIS IS FAIRLY USELESS
        //alert('error = ' + error);

    }

    getPhoneGapPath() {
        'use strict';
        var path = window.location.pathname;
        var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
        return phoneGapPath;
    }


    // iOS
    onNotificationAPN(event) {

        if (event.alert) {
            navigator.notification.alert(event.alert, function () { });
        }

        var snd = new Media('img/ding.mp3', function () { }, function (err) { });

        snd.play();

        if (event.sound) {
            var snd = new Media(event.sound, function () {
            }, function (err) { });
            snd.play();
        }

        if (event.badge) {
            this.pushNotification.setApplicationIconBadgeNumber(pushManager.createDelegate(this, this.successHandler), pushManager.createDelegate(this, this.errorHandler), event.badge);
        }
    }

    // Android and Amazon Fire OS
    onNotification(e) {
        //$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    this.registerToken(e.regid);
                }
                break;

            case 'message':

                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                if (e.foreground) {
                    //$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                    // on Android soundname is outside the payload.
                    // On Amazon FireOS all custom attributes are contained within payload
                    //var soundfile = e.soundname || e.payload.sound;
                    //// if the notification contains a soundname, play it.
                    //var my_media = new Media("/android_asset/www/" + soundfile, function () {
                    //});
                    //    my_media.play();

                    navigator.notification.alert(e.message, function () { });

                    var snd = new Media(this.getPhoneGapPath() + 'img/ding.mp3', function () { }, function (err) { });
                    snd.play();

                }
                else {  // otherwise we were launched because the user touched a notification in the notification tray.

                    if (e.coldstart) {
                    
                        //$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');

                    }
                    else {
                    
                        //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');

                    }

                    navigator.notification.alert(e.message, function () { });

                    var snd = new Media(this.getPhoneGapPath() + 'img/ding.mp3', function () { }, function (err) { });
                    snd.play();

                }

                //$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                //Only works for GCM
                //$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                //Only works on Amazon Fire OS
                //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
                break;

            case 'error':
                //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

            default:
                //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
        }
    }


}

var $pm = new pushManager();
export = $pm;
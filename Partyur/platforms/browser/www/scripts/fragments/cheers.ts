/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
import xhr = require('../xhr');

import __stateManager = require('./stateManager');

export function report(postId: string) {

    xhr.makeRequest(__stateManager.activeBaseURL() + '/post/cheers/?report=true', { postId: postId }

        , function (e) {

            alert('Thank you, we will review this post');

            //var modal = $("#cheersAnimation").data("kendoMobileModalView");

            //modal.open(null);

            ////modal.element.css()

            //modal.element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) { modal.close() });

            //modal.element.addClass('animated rubberBand');


        }, function (e) {

            //// NOT SURE WHAT DO DO ON A FAIL

        }, {
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            token: __stateManager.getToken()
        });


    return false;
}

export function cheers(postId: string) {

    //e.preventDefault();
    //(<any>e).stopPropagation();


    xhr.makeRequest(__stateManager.activeBaseURL() + '/post/cheers/', { postId: postId }
        , function (e) {

            var modal = $("#cheersAnimation").data("kendoMobileModalView");

            modal.open(null);

            //modal.element.css()

            modal.element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) { modal.close() });

            modal.element.addClass('animated rubberBand');


        }, function (e) {

            //// NOT SURE WHAT DO DO ON A FAIL

        }, {
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            token: __stateManager.getToken()
        });


    return false;
}
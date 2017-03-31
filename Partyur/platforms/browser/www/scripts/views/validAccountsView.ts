/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../typings/jquery.parsley/jquery.parsley.d.ts" />

import baseView = require('../fragments/baseView');
import __stateManager = require('../fragments/stateManager');
import __favoritesManager = require('../fragments/favorites');

import xhr = require('../xhr');

class validAccountsView extends baseView {

    validator: Parsley.Parsley;

    data: kendo.data.ObservableObject;

    tel: JQuery;

    email: JQuery;

    constructor(view: kendo.mobile.ui.View) {
        super(view)

        this.addEvent($(__stateManager), 'STATE_UPDATE', validAccountsView.createDelegate(this, this.onStateChanged));



    }

    onStateChanged(data) {

        this.data = null;

        //this.data = new kendo.data.ObservableObject(data);

        //this.data.set('phone', '7029091234');

        //this.data.set('email', 'test@load.com');

    }

    getData() {

        if (this.view) {
            kendo.bind(this.view.element, this.data);
        }

    }

    onChange(e: Event) {

        $(e.target).parents('.form-group').addClass('verifying');

        __stateManager.updateEmailAddress($(e.target).val(), undefined, function (err) {

            $(e.target).parents('.form-group').removeClass('verifying');

            $(e.target).parents('.form-group').addClass('verificationSent');

        });

    }

    onShow(e: kendo.mobile.ui.ViewShowEvent) {

        super.onShow(e);

        //if (!this.data) {

            this.data = __stateManager.getAccountInfo();

            //            try {

            kendo.bind(this.view.element, this.data);

            //           } catch (ex) {
            //               console.log(ex.message);
            //           }
        //}

        //if (this.data) {

        //    this.getData()

        //}

        if (!this.validator) {



            this.validator = this.view.element.find('form').parsley(window['ParsleyConfig']);

            this.view.element.find('form input').on('change', validAccountsView.createDelegate(this, this.onChange));

            var ellipsis = {
                'value': ['', '.', '..', '...'],
                'count': 0,
                'run': false,
                'timer': null,
                'element': '.ellipsis',
                'start': function () {
                    var t = this;
                    this.run = true;
                    this.timer = setInterval(function () {
                        if (t.run) {
                            $(t.element).css({ minWidth: '10px', display: 'inline-block', textAlign: 'left' }).html(t.value[t.count % t.value.length]).text();
                            t.count++;
                        }
                    }, 250);
                },
                'stop': function () {
                    this.run = false;
                    clearInterval(this.timer);
                    this.count = 0;
                }
            }

            ellipsis.start();

        }



    }

}
module validAccountsView {

    var $me: validAccountsView;

    export function init(e: kendo.mobile.ui.ViewInitEvent) {

        $me = new validAccountsView(e.view);

    }
}



export = validAccountsView
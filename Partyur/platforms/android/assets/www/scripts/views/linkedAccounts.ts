/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />

import baseView = require('../fragments/baseView');
import __stateManager = require('../fragments/stateManager');

import xhr = require('../xhr');

class linkedAccounts extends baseView {


    constructor(view: kendo.mobile.ui.View) {

        super(view)


        this.addEvent($(__stateManager), 'FAVORITES_UPDATE', linkedAccounts.createDelegate(this, this.onStateUpdated));


    }


    onStateUpdated(data) {




    }


}
module linkedAccounts {
    var $me: linkedAccounts;
    export function init(e: kendo.mobile.ui.ViewInitEvent) {
        $me = new linkedAccounts(e.view);
    }
}


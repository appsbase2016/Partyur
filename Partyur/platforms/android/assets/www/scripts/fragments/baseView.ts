/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
import uiClass = require('./uiClass');

class baseView extends uiClass {

    protected view: kendo.mobile.ui.View;

    constructor(view: kendo.mobile.ui.View) {

        super();

        this.view = view;
        var $this = this;

        this.view.bind('show', baseView.createDelegate(this, this.onShow));

        this.view.bind('beforeShow', baseView.createDelegate(this, this.onBeforeShow));

    }

    onBeforeShow(e: kendo.mobile.ui.ViewShowEvent) {

    }

    onShow(e: kendo.mobile.ui.ViewShowEvent) {

    }

}

module baseView {

    var me: baseView = null;

    export function init(e: kendo.mobile.ui.ViewInitEvent) {
        me = new baseView(e.sender);
    }



}

export = baseView;
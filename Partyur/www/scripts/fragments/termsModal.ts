import baseModalView = require('./baseModalView');

import __cheers = require('fragments/cheers');

class termsModal extends baseModalView {

    private imageSurface: JQuery;

    private postData: kendo.data.ObservableObject = null;

    constructor(e: kendo.mobile.ui.ModalView) {

        super(e);

    }

    public onShow(e: kendo.mobile.ui.ViewShowEvent) {
        super.onShow(e);
    }

}

module termsModal {

    var me: termsModal = null;

    export function init(e: kendo.mobile.ui.ModalViewInitEvent) {
        me = new termsModal(e.sender);
    }

    export function view(id: kendo.ui.TouchTapEvent) {

        me.show();

    }

}

export = termsModal; 
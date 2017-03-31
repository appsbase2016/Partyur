/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />

import uiClass = require('./uiClass');

class baseModalView extends uiClass {

    protected view: kendo.mobile.ui.ModalView;

    constructor(view: kendo.mobile.ui.ModalView) {

        super();

        var $this = this;

        this.view = view;

        this.view.bind('show', baseModalView.createDelegate(this, this.onShow));

        this.view.element.find('[data-dismiss="modal"]').click(baseModalView.createDelegate(this, this.onClose));

    }

    public onClose(e) {
        this.close();
    }

    public close() {
        this.view.close();
    }

    public onShow(e: kendo.mobile.ui.ViewShowEvent) {

    }

    public show(target?: JQuery) {
        this.view.open(target);
    }


}
export = baseModalView;
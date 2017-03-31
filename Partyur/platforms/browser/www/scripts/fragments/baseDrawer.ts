/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
import uiClass = require('./uiClass');

class baseDrawer extends uiClass {

    protected drawer: kendo.mobile.ui.Drawer;

    constructor(drawer: kendo.mobile.ui.Drawer) {

        super();

        this.drawer = drawer;

        this.drawer.bind('show', uiClass.createDelegate(this, this.onShow));

    }

    public show() {

        this.drawer.show();

    }

    public onShow(e: kendo.mobile.ui.DrawerShowEvent) {

        //console.log('base show');

    }

}
export = baseDrawer;
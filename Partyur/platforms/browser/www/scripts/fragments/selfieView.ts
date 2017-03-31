import baseModalView = require('./baseModalView');

import __cheers = require('fragments/cheers');

class photoViewer extends baseModalView {

    private imageSurface: JQuery;

    private postData: kendo.data.ObservableObject = null;

    constructor(e: kendo.mobile.ui.ModalView) {
        super(e);

        this.view.element.find('[data-action="share"]').click(baseModalView.createDelegate(this, this.onShare));

    }

    public onShow(e: kendo.mobile.ui.ViewShowEvent) {
        super.onShow(e);
    }

    public onShare(e: kendo.mobile.ui.ButtonClickEvent) {

        console.log((<any>window.plugins).socialsharing);
        //(<any>window.plugins).socialsharing.shareViaFacebookWithPasteMessageHint();
        (<any>window.plugins).socialsharing.share('Hey come check out guudtimes the party app', 'guudtimes: the party app', null, 'http://www.guudtimes.com/');


    }

    public cheers(e: kendo.mobile.ui.ButtonClickEvent) {

        __cheers.cheers(this.postData.get('_id'));

    }

    public report(e: kendo.mobile.ui.ButtonClickEvent) {
        __cheers.report(this.postData.get('_id'));
    }

    public setImage(data: any) {

        if (!this.imageSurface) {
            this.imageSurface = this.view.element;
        }

        this.postData = kendo.observable(data);

        kendo.unbind((<any>this.view).header);
        kendo.unbind((<any>this.view).content);
        //kendo.unbind((<any>this.view).element);
        //kendo.bind((<any>this.view).content, this.postData);

        this.imageSurface.css('background-image', 'url(\'http://guudtimes.s3.amazonaws.com/photos/' + data._id + '.jpg\')');



        kendo.bind((<any>this.view).header, this.postData);
        kendo.bind((<any>this.view).content, this.postData);

    }

    //public datasource() {
    //    return this.view['datasource'];
    //}

    public setVideo() {

    }

}

module photoViewer {

    var me: photoViewer = null;

    export function init(e: kendo.mobile.ui.ModalViewInitEvent) {
        me = new photoViewer(e.sender);
    }

    export function view(id: kendo.ui.TouchTapEvent) {


        if (id.touch['initialTouch'].nodeName === "I") {
            return;
        }
        //me.

        //var a = me['view']['dataSource']

        var data = id.sender.wrapper.parent().parent().parent().data('kendoMobileListView').dataSource.getByUid(id.sender.element.attr('data-uid'));

        me.setImage(data);

        me.show();

        //me.setVideo()

    }

    export function report(e: kendo.mobile.ui.ButtonClickEvent) {
        me.report(e);
    }

    export function cheers(e: kendo.mobile.ui.ButtonClickEvent) {
        me.cheers(e);
    }

}

export = photoViewer; 
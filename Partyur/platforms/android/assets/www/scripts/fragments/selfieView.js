var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './baseModalView', 'fragments/cheers'], function (require, exports, baseModalView, __cheers) {
    var photoViewer = (function (_super) {
        __extends(photoViewer, _super);
        function photoViewer(e) {
            _super.call(this, e);
            this.postData = null;
            this.view.element.find('[data-action="share"]').click(baseModalView.createDelegate(this, this.onShare));
        }
        photoViewer.prototype.onShow = function (e) {
            _super.prototype.onShow.call(this, e);
        };
        photoViewer.prototype.onShare = function (e) {
            console.log(window.plugins.socialsharing);
            //(<any>window.plugins).socialsharing.shareViaFacebookWithPasteMessageHint();
            window.plugins.socialsharing.share('Hey come check out guudtimes the party app', 'guudtimes: the party app', null, 'http://www.guudtimes.com/');
        };
        photoViewer.prototype.cheers = function (e) {
            __cheers.cheers(this.postData.get('_id'));
        };
        photoViewer.prototype.report = function (e) {
            __cheers.report(this.postData.get('_id'));
        };
        photoViewer.prototype.setImage = function (data) {
            if (!this.imageSurface) {
                this.imageSurface = this.view.element;
            }
            this.postData = kendo.observable(data);
            kendo.unbind(this.view.header);
            kendo.unbind(this.view.content);
            //kendo.unbind((<any>this.view).element);
            //kendo.bind((<any>this.view).content, this.postData);
            this.imageSurface.css('background-image', 'url(\'http://guudtimes.s3.amazonaws.com/photos/' + data._id + '.jpg\')');
            kendo.bind(this.view.header, this.postData);
            kendo.bind(this.view.content, this.postData);
        };
        //public datasource() {
        //    return this.view['datasource'];
        //}
        photoViewer.prototype.setVideo = function () {
        };
        return photoViewer;
    })(baseModalView);
    var photoViewer;
    (function (photoViewer) {
        var me = null;
        function init(e) {
            me = new photoViewer(e.sender);
        }
        photoViewer.init = init;
        function view(id) {
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
        photoViewer.view = view;
        function report(e) {
            me.report(e);
        }
        photoViewer.report = report;
        function cheers(e) {
            me.cheers(e);
        }
        photoViewer.cheers = cheers;
    })(photoViewer || (photoViewer = {}));
    return photoViewer;
});

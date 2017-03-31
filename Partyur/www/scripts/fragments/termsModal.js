var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './baseModalView'], function (require, exports, baseModalView) {
    var termsModal = (function (_super) {
        __extends(termsModal, _super);
        function termsModal(e) {
            _super.call(this, e);
            this.postData = null;
        }
        termsModal.prototype.onShow = function (e) {
            _super.prototype.onShow.call(this, e);
        };
        return termsModal;
    })(baseModalView);
    var termsModal;
    (function (termsModal) {
        var me = null;
        function init(e) {
            me = new termsModal(e.sender);
        }
        termsModal.init = init;
        function view(id) {
            me.show();
        }
        termsModal.view = view;
    })(termsModal || (termsModal = {}));
    return termsModal;
});

/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../kendo/typescript/jquery.d.ts" />
/// <reference path="../../typings/jquery.parsley/jquery.parsley.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../xhr', '../fragments/baseView', './stateManager', 'fragments/admins'], function (require, exports, xhr, baseView, __stateManager, __adminsManager) {
    var locationManager = (function (_super) {
        __extends(locationManager, _super);
        function locationManager(view) {
            _super.call(this, view);
            this.list = null;
            this.selectedLocation = null;
            var $this = this;
            this.data = new kendo.data.DataSource({ data: __stateManager.state.admin });
            this.addEvent($(__adminsManager), 'ADMINS_UPDATE', $this.onAdminsUpdated);
        }
        locationManager.prototype.onAdminsUpdated = function (e, data) {
            try {
                this.data = new kendo.data.DataSource({ data: data });
                if (this.list)
                    this.list.setDataSource(this.data);
            }
            catch (ex) {
            }
        };
        locationManager.prototype.onManageLocation = function (e) {
            this.selectedLocation = e.dataItem;
            __stateManager.navigate('#manageLocationSpecials');
            var a = new kendo.data.ObservableObject(this.selectedLocation);
            a.set('update', locationManager.createDelegate(this, this.onPostPromo));
            kendo.bind("#manageLocationSpecials", a);
            //console.log(e);
        };
        locationManager.prototype.onPostPromo = function (e) {
            var promo = e.target.parents('.km-scroll-container').find('[data-id="promoText"]').val();
            var promoExpire = e.target.parents('.km-scroll-container').find('[data-id="promoExpire"]').val();
            //console.log('post promo', );
            this.selectedLocation.set('promo', promo);
            __adminsManager.setPromo(this.selectedLocation._id, promo, function (err) {
                __stateManager.navigate('#add');
                //console.log('this worked', err);
            });
        };
        locationManager.prototype.onShow = function (e) {
            _super.prototype.onShow.call(this, e);
            if (!this.list) {
                this.list = this.view.element.find('.manageListActive [data-role="listview"]').kendoMobileListView({
                    template: $('#favoriteListItem').html(),
                    click: locationManager.createDelegate(this, this.onManageLocation)
                }).data('kendoMobileListView');
                if (this.data) {
                    this.list.setDataSource(this.data);
                }
            }
        };
        return locationManager;
    })(baseView);
    var newlocation = (function (_super) {
        __extends(newlocation, _super);
        function newlocation(view) {
            _super.call(this, view);
            var $this = this;
            this.data = new kendo.data.ObservableObject({ data: { name: "", address1: "", city: "", hood: "", zip: "", phone: "", lng: 0.0, lat: 0.0, loc: '' } });
            this.addEvent($(__adminsManager), 'ADMINS_UPDATE', $this.onAdminsUpdated);
            this.btn = $(this.view.element.find('[data-id="add"]'));
            this.btn.click(newlocation.createDelegate(this, this.onAdd));
            kendo.bind(this.view.element, this.data);
            this.getCurrentLocationCityStateZip();
            $(this.view.element.find('[data-id="phone"]')).intlTelInput({
                nationalMode: true,
                utilsScript: "scripts/phone/utilScript.js" // just for formatting/placeholders etc
            });
            if (!this.validator) {
                this.validator = this.view.element.find('form').parsley(window['ParsleyConfig']);
            }
        }
        newlocation.prototype.clearForm = function () {
            kendo.unbind(this.view.element);
            this.data = new kendo.data.ObservableObject({ data: { name: "", address1: "", city: "", hood: "", zip: "", phone: "", lng: 0.0, lat: 0.0, loc: '' } });
            kendo.bind(this.view.element, this.data);
        };
        newlocation.prototype.getCurrentLocationCityStateZip = function () {
            var $this = this;
            __stateManager.getNearbyLocations(function (err, loc, data) {
                if (err) { }
                else {
                    xhr.makeRequest('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + loc.latLng.lat + ',' + loc.latLng.lng + '&sensor=false', null, function (data) {
                        var bestGuess = null;
                        try {
                            var bestGuess = data.results[0];
                        }
                        catch (ex) { }
                        if (bestGuess) {
                            console.log(bestGuess);
                            if (bestGuess.formatted_address) {
                                $this.data.set('address1', bestGuess.formatted_address.split(',')[0]);
                            }
                            bestGuess.address_components.forEach(function (value, index, ar) {
                                if ((value.types.indexOf('sublocality_level_1') > -1 || value.types.indexOf('sublocality') > -1 || value.types.indexOf('locality') > -1) && value.types.indexOf('political') > -1) {
                                    $this.data.set('city', value.long_name);
                                }
                                if (value.types.indexOf('neighborhood') > -1 && value.types.indexOf('political') > -1) {
                                    $this.data.set('hood', value.long_name);
                                }
                                if (value.types.indexOf('postal_code') > -1) {
                                    $this.data.set('zip', value.short_name);
                                }
                            });
                        }
                        $this.data.set('lng', loc.latLng.lng);
                        $this.data.set('lat', loc.latLng.lat);
                        $this.data.set('loc', 'lat: ' + loc.latLng.lat + ', lng: ' + loc.latLng.lng);
                    }, function (err) { }, {
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                    });
                }
            });
        };
        newlocation.prototype.onAdd = function (e) {
            if (this.validator.validate()) {
                //console.log('time to add');
                xhr.makeRequest(__stateManager.activeBaseURL() + '/location', { newLocation: this.data }, function (res) {
                    __adminsManager.claim(res.data._id, function () {
                        __stateManager.navigate('#add');
                    });
                }, function (err) {
                    alert('There was an error adding this location');
                }, {
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    token: __stateManager.getToken()
                });
            }
        };
        newlocation.prototype.onBeforeShow = function (e) {
            console.log('time to update form');
            this.clearForm();
            this.getCurrentLocationCityStateZip();
        };
        newlocation.prototype.onAdminsUpdated = function (e, data) {
            try {
            }
            catch (ex) {
            }
        };
        return newlocation;
    })(baseView);
    var locationManager;
    (function (locationManager) {
        var me = null;
        var add = null;
        function init(e) {
            me = new locationManager(e.sender);
        }
        locationManager.init = init;
        function initAdd(e) {
            add = new newlocation(e.sender);
        }
        locationManager.initAdd = initAdd;
    })(locationManager || (locationManager = {}));
    return locationManager;
});

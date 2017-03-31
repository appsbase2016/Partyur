/// <reference path="../../kendo/typescript/kendo.mobile.d.ts" />
/// <reference path="../../kendo/typescript/jquery.d.ts" />
/// <reference path="../../typings/jquery.parsley/jquery.parsley.d.ts" />


import xhr = require('../xhr');
import baseView = require('../fragments/baseView');
import __stateManager = require('./stateManager');
import __adminsManager = require('fragments/admins');

import uiClass = require('./uiClass');

class locationManager extends baseView {

    private data: kendo.data.DataSource;

    private list: kendo.mobile.ui.ListView = null;

    private selectedLocation = null;

    constructor(view: kendo.mobile.ui.View) {

        super(view);

        var $this = this;

        this.data = new kendo.data.DataSource({ data: __stateManager.state.admin });

        this.addEvent($(__adminsManager), 'ADMINS_UPDATE', $this.onAdminsUpdated);


    }

    public onAdminsUpdated(e: JQueryEventObject, data) {

        try {

            this.data = new kendo.data.DataSource({ data: data });

            if (this.list)
                this.list.setDataSource(this.data);

        } catch (ex) {

        }
    }

    public onManageLocation(e) {

        this.selectedLocation = e.dataItem;

        __stateManager.navigate('#manageLocationSpecials');

        var a = new kendo.data.ObservableObject(this.selectedLocation);

        a.set('update', locationManager.createDelegate(this, this.onPostPromo));

        kendo.bind("#manageLocationSpecials", a);
        

        //console.log(e);

    }

    public onPostPromo(e) {

        var promo = e.target.parents('.km-scroll-container').find('[data-id="promoText"]').val();
        var promoExpire = e.target.parents('.km-scroll-container').find('[data-id="promoExpire"]').val();

        //console.log('post promo', );

        this.selectedLocation.set('promo', promo);

        __adminsManager.setPromo(this.selectedLocation._id, promo, function (err?) {


            __stateManager.navigate('#add');

            //console.log('this worked', err);

        })
    }

    public onShow(e: kendo.mobile.ui.ViewShowEvent) {

        super.onShow(e);

        if (!this.list) {
            this.list = this.view.element.find('.manageListActive [data-role="listview"]').kendoMobileListView(
                {
                    template: $('#favoriteListItem').html(),
                    click: locationManager.createDelegate(this, this.onManageLocation)
                }
                ).data('kendoMobileListView');
            if (this.data) {

                this.list.setDataSource(this.data);

            }
        }

    }

}

class newlocation extends baseView {

    private data: kendo.data.ObservableObject;

    private btn: JQuery;

    validator: Parsley.Parsley;

    constructor(view: kendo.mobile.ui.View) {

        super(view);

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

    private clearForm() {
        kendo.unbind(this.view.element);
        this.data = new kendo.data.ObservableObject({ data: { name: "", address1: "", city: "", hood: "", zip: "", phone: "", lng: 0.0, lat: 0.0, loc: '' } });
        kendo.bind(this.view.element, this.data);
    }

    public getCurrentLocationCityStateZip() {

        var $this = this;

        __stateManager.getNearbyLocations(function (err, loc, data) {

            if (err) { } else {

                xhr.makeRequest('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + loc.latLng.lat + ',' + loc.latLng.lng + '&sensor=false', null, function (data) {

                    var bestGuess = null;

                    try {
                        var bestGuess = data.results[0];
                    } catch (ex) { }

                    if (bestGuess) {

                        console.log(bestGuess);

                        if (bestGuess.formatted_address) {
                            $this.data.set('address1', bestGuess.formatted_address.split(',')[0]);
                        }

                        (<Array<{ long_name: string, short_name: string, types: Array<string> }>>bestGuess.address_components).forEach(function (value, index, ar) {


                            if ((value.types.indexOf('sublocality_level_1') > -1 || value.types.indexOf('sublocality') > -1 || value.types.indexOf('locality') > -1) && value.types.indexOf('political') > -1) {
                                $this.data.set('city', value.long_name);
                            }

                            if (value.types.indexOf('neighborhood') > -1 && value.types.indexOf('political') > -1) {
                                $this.data.set('hood', value.long_name);
                            }

                            if (value.types.indexOf('postal_code') > -1) {
                                $this.data.set('zip', value.short_name);
                            }

                        })
                    }

                    $this.data.set('lng', loc.latLng.lng);

                    $this.data.set('lat', loc.latLng.lat);

                    $this.data.set('loc', 'lat: ' + loc.latLng.lat + ', lng: ' + loc.latLng.lng);

                }, function (err) { }, {

                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        //token: this.getToken()

                    });
            }
        });


    }

    public onAdd(e: JQueryEventObject) {

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
                })
        }

    }

    onBeforeShow(e: kendo.mobile.ui.ViewShowEvent) {

        console.log('time to update form');

        this.clearForm();

        this.getCurrentLocationCityStateZip();

    }

    public onAdminsUpdated(e: JQueryEventObject, data) {

        try {

        } catch (ex) {

        }

    }

}

module locationManager {

    var me: locationManager = null;
    var add: newlocation = null;

    export function init(e: kendo.mobile.ui.ViewInitEvent) {
        me = new locationManager(e.sender);
    }

    export function initAdd(e: kendo.mobile.ui.ViewInitEvent) {
        add = new newlocation(e.sender);
    }

}

export = locationManager; 
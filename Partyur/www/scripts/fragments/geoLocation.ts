  
interface geoInfo {
    latitude?: any;
    longitude?: any;
    altitude?: any;
    accuracy?: any;
    altitudeAccuracy?: any;
    heading?: any;
    speed?: any;
    timestamp?: any;
    code?: any;
    message?: any;
}

export class geoLocation {

    options = {
        enableHighAccuracy: true
    }

    info: geoInfo;

    watchId: number;

    constructor() {

        this.info = null;

    }

    getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(function () {

            //PositionCallback

            //navigator.geolocation.stop();
        }, function () { }, { enableHighAccuracy: true, timeout: 10 });
    }

    trackLocation() {

        var that = this;

        if (that.watchId != null) {

            that._setResults();

            navigator.geolocation.clearWatch(that.watchId);

            that.watchId = null;

        }
        else {

            //that._setResults();
            // Update the watch every second.

            var options = {
                frequency: 1000,
                enableHighAccuracy: true
            };

            that.watchId = navigator.geolocation.watchPosition(function () {
                that._onSuccess.apply(that, arguments);
            }, function () {
                    that._onError.apply(that, arguments);
                }, options);
            //button.innerHTML = "Clear Geolocation Watch";

        }
    }

    _setResults(value?: geoInfo) {

        if (value) {
            this.info = value;
        }
        else {
            this.info = true;
        }

    }

    _onSuccess(position) {

        // Successfully retrieved the geolocation information. Display it all.
        
        this._setResults({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: new Date(position.timestamp).toLocaleTimeString().split(" ")[0]
        });

    }

    _onError(error) {
        this._setResults({ code: error.code, message: error.message });
    }


}
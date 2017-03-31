define(["require", "exports"], function (require, exports) {
    var geoLocation = (function () {
        function geoLocation() {
            this.options = {
                enableHighAccuracy: true
            };
            this.info = null;
        }
        geoLocation.prototype.getCurrentLocation = function () {
            navigator.geolocation.getCurrentPosition(function () {
                //PositionCallback
                //navigator.geolocation.stop();
            }, function () { }, { enableHighAccuracy: true, timeout: 10 });
        };
        geoLocation.prototype.trackLocation = function () {
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
            }
        };
        geoLocation.prototype._setResults = function (value) {
            if (value) {
                this.info = value;
            }
            else {
                this.info = true;
            }
        };
        geoLocation.prototype._onSuccess = function (position) {
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
        };
        geoLocation.prototype._onError = function (error) {
            this._setResults({ code: error.code, message: error.message });
        };
        return geoLocation;
    })();
    exports.geoLocation = geoLocation;
});

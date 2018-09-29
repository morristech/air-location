class Location {
  /**
   * Constructor perro, recibe callbacks para procesar info desde donde sea llamado.
   * @param {function} onSucess receives position object.
   * @param {function} onError receives error object
   * @param {*} watchOptions
   * { timeout: number, maximumAge: number, enableHighAccuracy: bool, distanceFilter: number, ueSignificantChanges: bool }
   */
  constructor(onSucess, onError, watchOptions) {
    this._geolocation = navigator.geolocation;
    this._onSuccess = onSucess;
    this._onError = onError;
    this._watchOptions = watchOptions;
    this._watchId = undefined;
  }

  getCurrent() {
    this._geolocation.getCurrentPosition(this._onSuccess, this._onError, this._watchOptions);
  }

  watchPosition() {
    this._watchId = this._geolocation.watchPosition(this._onSuccess, this._onError, this._watchOptions);
  }

  clearWatch() {
    this._geolocation.clearWatch(this._watchId);
    this._watchId = undefined;
    // this._geolocation.stopObserving();
  }

  isWatching() {
    if (this._watchId !== undefined) { return true; }
    return false;
  }
}

export default Location;

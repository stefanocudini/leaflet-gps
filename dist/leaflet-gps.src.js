/* 
 * Leaflet Control GPS v1.7.6 - 2018-05-28 
 * 
 * Copyright 2018 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * http://labs.easyblog.it/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demos: 
 * http://labs.easyblog.it/maps/leaflet-gps/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-gps.git 
 * 
 */
(function (factory) {
    if(typeof define === 'function' && define.amd) {
    //AMD
        define(['leaflet'], factory);
    } else if(typeof module !== 'undefined') {
    // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
    // Browser globals
        if(typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.L);
    }
})(function (L) {

L.Control.Gps = L.Control.extend({

	includes: L.version[0] =='1' ? L.Evented.prototype : L.Mixin.Events,
	//
	//Managed Events:
	//	Event			Data passed			Description
	//
	//	gps:located		{marker,latlng}	 	fired after gps marker is located
	//	gps:disabled	{marker}			fired after gps is disabled
	//	gps:error	    {message}			fired after gps error
	//
	//Methods exposed:
	//	Method 			Description
	//
	//  getLocation		return Latlng and marker of current position
	//  activate		active tracking on runtime
	//  deactivate		deactive tracking on runtime
	//
	options: {
		autoActive: false,		//activate control at startup
		autoCenter: false,		//move map when gps location change
		maxZoom: null,			//max zoom for autoCenter
		textErr: '',			//error message on alert notification
		callErr: null,			//function that run on gps error activating
		title: 'Center map on your location',
		marker: null,			//L.Marker used for location, default use a L.CircleMarker
		style: {				//default L.CircleMarker styles
			radius: 5,
			weight: 2,
			color: '#c20',
			opacity: 1,
			fillColor: '#f23',
			fillOpacity: 1
		},
		//accuracy: true,		//show accuracy Circle
		position: 'topleft',
		transform: function(latlng) { return latlng },
		//TODO add gpsLayer
		//TODO timeout autoCenter
	},

	initialize: function(options) {
		if(options && options.style)
			options.style = L.Util.extend({}, this.options.style, options.style);
		L.Util.setOptions(this, options);
		this._errorFunc = this.options.callErr || this.showAlert;
		this._isActive = false;
		this._isLoading = false;
		this._currentLocation = null;	//store last location
	},

	onAdd: function (map) {

		this._map = map;

		var container = L.DomUtil.create('div', 'leaflet-control-gps');

		this._button = L.DomUtil.create('a', 'gps-button', container);
		this._button.href = '#';
		this._button.title = this.options.title;

		L.DomEvent
			.on(this._button, 'dblclick', L.DomEvent.stop, this)
			.on(this._button, 'click', L.DomEvent.stop, this)
			.on(this._button, 'click', this._switchGps, this);

		this._alert = L.DomUtil.create('div', 'gps-alert', container);
		this._alert.style.display = 'none';

		this._gpsMarker = this.options.marker ? this.options.marker : new L.CircleMarker([0,0], this.options.style);
		//if(this.options.accuracy)
		//	this._accuracyCircle = new L.Circle([0,0], this.options.style);

		this._map
			.on('locationfound', this._drawGps, this)
			.on('locationerror', this._errorGps, this);

		if(this.options.autoActive)
			this.activate();

		return container;
	},

	onRemove: function(map) {
		this.deactivate();

		map.off('locationfound', this._drawGps, this)
		   .off('locationerror', this._errorGps, this);
	},

	_switchGps: function() {
		if(this._isActive || this._isLoading)
			this.deactivate();
		else
			this.activate();
	},

	getLocation: function() {	//get last location
		return this._currentLocation;
	},

	activate: function() {

		this._isActive = true;
		this._isLoading = true;
		this._map.addLayer( this._gpsMarker );

		L.DomUtil.addClass(this._button, 'loading');
		
		this._map.once('locationfound', function(e) {
			
			L.DomUtil.removeClass(this._button, 'loading');
			L.DomUtil.removeClass(this._button, 'disabled');
			L.DomUtil.addClass(this._button, 'active');

			this._isLoading = false;
			
			if(this.options.autoCenter)
				this._map.setView(e.latlng, this.options.maxZoom || this._map.getZoom());

		}, this);

		this._map.locate({
			enableHighAccuracy: false,
			watch: true,
			setView: false,//this.options.autoCenter,
			//maxZoom: this.options.maxZoom || this._map.getZoom()
		});
	},

	deactivate: function() {
		
		this._isActive = false;
		this._isLoading = false;
		
		L.DomUtil.removeClass(this._button, 'active');
		L.DomUtil.removeClass(this._button, 'loading');

		if(this._map) {
			this._map.stopLocate();
			this._map.removeLayer( this._gpsMarker );
		}		
		
		//this._gpsMarker.setLatLng([-90,0]);  //move to antarctica!
		//TODO make method .hide() using _icon.style.display = 'none'
		this.fire('gps:disabled', {marker: this._gpsMarker});
	},

	_drawGps: function(e) {
		
		var self = this;

		//TODO use e.accuracy for gps circle radius/color
		this._currentLocation = this.options.transform(e.latlng);
		
		this._gpsMarker.setLatLng(this._currentLocation);

		if(this.options.autoCenter) {

			this._map.once('moveend zoomend', function(e) {
						
				self.fire('gps:located', {
					latlng: self._currentLocation,
					marker: self._gpsMarker
				});
			});
			
			this._map.panTo(e.latlng);
		}
		else {
			self.fire('gps:located', {
				latlng: self._currentLocation,
				marker: self._gpsMarker
			});
		}


	//    	if(this._gpsMarker.accuracyCircle)
	//    		this._gpsMarker.accuracyCircle.setRadius((e.accuracy / 2).toFixed(0));
	},

	_errorGps: function(e) {
		this.fire('gps:error', e);

		this.deactivate();
		
		L.DomUtil.addClass(this._button, 'disabled');

		this._errorFunc.call(this, this.options.textErr || e.message);
	},

	/*	_updateAccuracy: function (event) {
			var newZoom = this._map.getZoom(),
				scale = this._map.options.crs.scale(newZoom);
			this._gpsMarker.setRadius(this.options.style.radius * scale);
			this._gpsMarker.redraw();
		},
	*/
	showAlert: function(text) {
		this._alert.style.display = 'block';
		this._alert.innerHTML = text;
		var that = this;
		clearTimeout(this.timerAlert);
		this.timerAlert = setTimeout(function() {
			that._alert.style.display = 'none';
		}, 5000);
	}
});

L.Map.addInitHook(function () {
	if (this.options.gpsControl) {
		this.gpsControl = L.control.gps(this.options.gpsControl);
		this.addControl(this.gpsControl);
	}
});

L.control.gps = function (options) {
	return new L.Control.Gps(options);
};

	return L.Control.Gps;
});


/*
 * Leaflet Gps Control 1.0.0
 * https://github.com/stefanocudini/leaflet-gps
 * https://bitbucket.org/zakis_/leaflet-gps
 * http://labs.easyblog.it/maps/leaflet-gps
 *
 * Copyright 2013, Stefano Cudini - stefano.cudini@gmail.com
 * Licensed under the MIT license.
 */

L.Control.Gps = L.Control.extend({

	includes: L.Mixin.Events, 
	//
	//Managed Events:
	//	Event			Data passed			Description
	//	gpslocated		{marker,latlng}		fired after gps marker is located
	//
	options: {
		position: 'topleft',
		//TODO add gpsLayer
		autoActive: false,
		autoTracking: false,
		//TODO timeout autoTracking
		maxZoom: null,		//max zoom for autoTracking
		showMarker: false,		//show marker or circle
		title: 'Center map on your location',
		textErr: null,
		callErr: null,
		style: {radius: 16, weight:3, color: '#e03', fill: false}	//circle style
	},

	initialize: function(options) {
		if(options && options.style)
			options.style = L.Util.extend({}, this.options.style, options.style); 
		L.Util.setOptions(this, options);
		this._errorFunc = this.options.callErr || this.showAlert;
		this._isActive = false;//global state of gps
		this._currentLocation = null;	//store last location
	},
	
    onAdd: function (map) {
    
    	this._map = map;	
        	
        var container = L.DomUtil.create('div', 'leaflet-control-gps');

        this._button = L.DomUtil.create('a', 'gps-button', container);
        this._button.href = '#';
        this._button.title = this.options.title;
		L.DomEvent
			.on(this._button, 'click', L.DomEvent.stop, this)
			.on(this._button, 'click', this._switchGps, this);

		this._alert = L.DomUtil.create('div', 'gps-alert', container);
		this._alert.style.display = 'none';

		this._gps = this._createGps();
		this._map.addLayer( this._gps );
		this._map
			.on('locationfound', this._drawGps, this)
			.on('locationerror', this._errorGps, this);	
			
		if(this.options.autoActive)
			this.activate();

        return container;
    },
    
	onRemove: function(map) {
		this.deactivate();
	},
	
	_createGps: function() {
		if(this.options.marker)
			return ( new L.Marker([0,0]) );
		else
			return ( new L.CircleMarker([0,0], this.options.style ));
	},
	
	_switchGps: function() {
		if(this._isActive)
			this.deactivate();
		else
			this.activate();
	},
	
	getLocation: function() {	//get last location
		return this._currentLocation;
	},
    
    activate: function() {
	    this._isActive = true;
	    this._map.locate({
	        enableHighAccuracy: true,
			watch: this.options.autoTracking,
			//maximumAge:s
	        setView: false,	//automatically sets the map view to the user location
			maxZoom: this.options.maxZoom   
	    });	    
    },
    
    deactivate: function() {
   		this._isActive = false;    
		this._map.stopLocate();
    	L.DomUtil.removeClass(this._button, 'active');
		this._gps.setLatLng([-90,0]);  //move to antarctica!
		//TODO make method .hide() using _icon.style.display = 'none'
    },
    
    _drawGps: function(e) {
    	//TODO use e.accuracy for gps circle radius/color
    	this._currentLocation = e.latlng;
    	
    	//TODO add new event here
    	
    	if(this.options.autoTracking || this._isActive)
			this._moveTo(e.latlng);
			
    	this._gps.setLatLng(e.latlng);
//    	if(this._gps.accuracyCircle)
//    		this._gps.accuracyCircle.setRadius((e.accuracy / 2).toFixed(0));
    		
    	this.fire('gpslocated', {marker: this._gps, latlng: e.latlng});
    	
    	L.DomUtil.addClass(this._button, 'active');	
    },
    
    _moveTo: function(latlng) {
		if(this.options.maxZoom)
			this._map.setView(latlng, Math.min(this._map.getZoom(), this.options.maxZoom) );
		else
			this._map.panTo(latlng);    
    },
    
    _errorGps: function(e) {
    	this.deactivate();
    	this._errorFunc.call(this, this.options.textErr || e.message);
    },
    
	showAlert: function(text) {
		this._alert.style.display = 'block';
		this._alert.innerHTML = text;
		var that = this;
		clearTimeout(this.timerAlert);
		this.timerAlert = setTimeout(function() {
			that._alert.style.display = 'none';
		}, 2000);
	}
});

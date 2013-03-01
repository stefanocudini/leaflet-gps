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

	options: {
		position: 'bottomleft',
		//TODO add gpsLayer
		autoActive: false,
		autoTracking: false,
		maxZoom: null,
		//TODO autozoom
		//TODO timeout autoTracking
		marker: false, //using a marker
		title: 'Center map on your location',
		textErr: null,
		style: {radius: 16, weight:3, color: '#e03', fill: false}
	},

	initialize: function(options) {
		if(options && options.style)
			options.style = L.Util.extend({}, this.options.style, options.style); 
		L.Util.setOptions(this, options);
		this._stateGps = false;//global state of gps
	},
	
    onAdd: function (map) {
    
    	this._map = map;
		this._gps = this._createGps();
		this._map.addLayer( this._gps );
        	
        var container = L.DomUtil.create('div', 'leaflet-control-gps');
        
        this._button = L.DomUtil.create('a', 'gps-button', container);
        this._button.href = '#';
        this._button.title = this.options.title;
		
		this._alert = L.DomUtil.create('div', 'gps-alert', container);
		this._alert.style.display = 'none';

        L.DomEvent
			.disableClickPropagation(this._button)
			.addListener(this._button, 'click', this._switchGps, this);
		
		L.DomEvent
			.addListener(map, 'locationfound', this._drawGps, this);
		//TODO refact animation on locationfound, look under
			
		L.DomEvent
			.addListener(map, 'locationerror', this._errorGps, this);//TODO refact

		if(this.options.autoActive)
			this._activeGps();

        return container;
    },
    
	onRemove: function(map) {
		this._deactiveGps();
	},
	
	_createGps: function() {
		if(this.options.marker)
			return ( new L.Marker([0,0]) );
		else
			return ( new L.CircleMarker([0,0], this.options.style ));
	},
	
	_switchGps: function() {
		if(this._stateGps)
			this._deactiveGps();
		else
			this._activeGps();
	},
    
    _activeGps: function() {
	    this._map.locate({
	        setView: true,	//automatically sets the map view to the user location
	        enableHighAccuracy: true,
			watch: this.options.autoTracking,
			//maximumAge:s
			maxZoom: this.options.maxZoom   
	    });
    },
    
    _deactiveGps: function() {
		this._map.stopLocate();
		this._stateGps = false;
    	L.DomUtil.removeClass(this._button, 'active');
		this._gps.setLatLng([0,0]);  //hide without destroy	
    },
    
    _drawGps: function(e) {
    	//e.accuracy	//TODO use for gps circle radius/color
    	//e.bounds
    	this._stateGps = true;
    	this._gps.setLatLng(e.latlng);
    	L.DomUtil.addClass(this._button, 'active');	
    },
    
    _errorGps: function(e) {
    	this._deactiveGps();
    	this.showAlert(this.options.textErr || e.message);
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

//TODO refact animation on locationfound
//	_animateLocation: function(latlng) {
//	
//		var circle = this._gps;
//		circle.setLatLng(latlng);
//		circle.setRadius(20);
//	
//		var	tt = 200,
//			ss = 10,
//			mr = parseInt(circle._radius/ss),
//			f = 0;
//		var	that = this;
//		this.timerAnimLoc = setInterval(function() {  //animation
//			f += 0.5;
//			mr += f;//adding acceleration
//			var nr = circle._radius - mr;
//			if( nr > 2)
//				circle.setRadius(nr);
//			else
//				clearInterval(that.timerAnimLoc);
//		}, tt);
//	},

});

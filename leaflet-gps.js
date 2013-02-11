/*
 * Leaflet Search Control 1.0.0
 * https://github.com/stefanocudini/leaflet-gps
 * https://bitbucket.org/zakis_/leaflet-gps
 * http://easyblog.it/maps/leaflet-gps
 *
 * Copyright 2012, Stefano Cudini - stefano.cudini@gmail.com
 * Licensed under the MIT license.
 */

L.Control.Gps = L.Control.extend({
	includes: L.Mixin.Events, 
	
    options: {
        position: 'topleft',
        gpsLayer: null,
        autoActive: false,
        title: 'Center map on your location'
    },

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this.options.gpsLayer = this.options.gpsLayer || new L.LayerGroup();
		this._stateGps = false;//global state of gps
	},
	
    onAdd: function (map) {
    
    	this._map = map;
		this._circleGps = (new L.CircleMarker([0,0], {radius: 20, weight:3, color: '#e03', fill: false})).addTo(this._map);
        	
        var container = L.DomUtil.create('div', 'leaflet-control-gps');
        
        this._button = L.DomUtil.create('a', 'gps-button', container);
        this._button.href = '#';
        this._button.title = this.options.title;
        
        L.DomEvent
			.disableClickPropagation(this._button)
			.addListener(this._button, 'click', this._activeGps, this);
			//TODO use this._stateGps for switch _activeGps/_deactivGps 
		
		L.DomEvent
			.addListener(map, 'locationfound', this._drawGps, this);
		//TODO refact animation on locationfound, look under
			
//		L.DomEvent
//			.addListener(map, 'locationerror', function(){ this._activeGps = false; }, this);//TODO refact

		if(this.options.autoActive)
			this._activeGps();

        return container;
    },
    
	onRemove: function(map) {
		this._deactiveGps();
	},
    
    _activeGps: function() {
	    this._map.locate({
	        setView: true,
	        enableHighAccuracy: true
			//watch:true
			//maximumAge:s	        
	    });
    },
    
    _deactiveGps: function() {
		this._map.stopLocate();
		this._stateGps = false;
    	L.DomUtil.removeClass(this._button, 'active');
		//TODO destroy this._circleGps		
    },
    
    _drawGps: function(e) {
    	//e.accuracy	//TODO use for circle radius/color
    	//e.bounds
    	this._stateGps = true;
    	this._circleGps.setLatLng(e.latlng);
    	L.DomUtil.addClass(this._button, 'active');	
    },

//TODO refact animation on locationfound
//	_animateLocation: function(latlng) {
//	
//		var circle = this._circleGps;
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

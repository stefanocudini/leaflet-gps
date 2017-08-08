Leaflet.Control.GPS
============

A leaflet control plugin for tracking gps position

Tested in Leaflet 0.7.7 and 1.1.0

**Demos online:**  
[labs.easyblog.it/maps/leaflet-gps](http://labs.easyblog.it/maps/leaflet-gps/)

# How to use

Adding the GPS Control to the map:

```
map.addControl( new L.Control.Gps() );
```

# Debugging

I recommend a chrome extension: 'Manual Geolocation'
for simulate gps device and set realtime position

[Manual Geolocation](https://chrome.google.com/webstore/detail/manual-geolocation/mfodligkojepnddfhkbkodbamcagfhlo)

You can also use a dummy `transform` function:

```
var tinnedGps = { lat: 52.5, lng: -2.0 };
map.addControl( new L.Control.Gps( { transform: function(realGps) { return tinnedGps; } ) );
```

# Where

**Demos online:**  
[labs.easyblog.it/maps/leaflet-gps](http://labs.easyblog.it/maps/leaflet-gps/)

**Source code:**  
[Github](https://github.com/stefanocudini/leaflet-gps)  
[Bitbucket](https://bitbucket.org/stefanocudini/leaflet-gps)  
[NPM](https://npmjs.org/package/leaflet-gps)  
[Atmosphere](https://atmosphere.meteor.com/package/leaflet-gps)

# Options
| Options			| Default			  | Description                               |
| ---------------------- | ---------------------- | ----------------------------------------- |
| autoActive  | false  | activate control at startup         |
| autoCenter  | false  | move map when gps location change   |
| maxZoom     | null   | max zoom for autoCenter             |
| textErr     | ''     | error message on alert notification |
| callErr     | null   | function that run on gps error activating |
| style       | {radius:5,color:'#c20',fillColor:'#f23'}  | default L.CircleMarker styles |
| marker      | null   | L.Marker used for location, default use a L.CircleMarker |
| accuracy    | true   | show accuracy Circle |
| title       | 'Center map on your location' | title control on mouse over |
| position    | 'topleft' | control position on map |
| transform   | function(latlng) { return latlng } | return location before for gps marker |
| setView     | false  | automatically sets the map view to the user location |

# Events
| Event			 | Data			  | Description                               |
| ---------------------- | ---------------------- | ----------------------------------------- |
| 'gps:located' | {marker, latlng} | fired after gps marker is located |
| 'gps:disabled'	 | {marker}	                  | fired after gps is disabled          |

# Methods
| Method		| Arguments		 | Description                  |
| --------------------- | ---------------------- | ---------------------------- |
| getLocation()		| 	 | return Latlng and marker of current position  |
| activate()           |  	 | active tracking on runtime           |
| deactivate()		| 	 | deactive tracking on runtime |

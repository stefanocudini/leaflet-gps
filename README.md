Leaflet.Control.GPS
============

A leaflet control plugin for tracking gps position

Tested in Leaflet 0.7.3

**Demos online:**  
[labs.easyblog.it/maps/leaflet-gps](http://labs.easyblog.it/maps/leaflet-gps/)

#How to use

Adding the GPS Control to the map:

```
map.addControl( new L.Control.Gps() );
```

#Debugging

I recommend a chrome extension: 'Manual Geolocation'
for simulate gps device and set realtime position

[Manual Geolocation](https://chrome.google.com/webstore/detail/manual-geolocation/mfodligkojepnddfhkbkodbamcagfhlo)

You can also use a dummy `transform` function:

```
var tinnedGps = { lat: 52.5, lng: -2.0 };
map.addControl( new L.Control.Gps( { transform: function(realGps) { return tinnedGps; } ) );
```

#Where

**Demos online:**  
[labs.easyblog.it/maps/leaflet-gps](http://labs.easyblog.it/maps/leaflet-gps/)

**Source code:**  
[Github](https://github.com/stefanocudini/leaflet-gps)  
[Bitbucket](https://bitbucket.org/zakis_/leaflet-gps)  
[NPM](https://npmjs.org/package/leaflet-gps)  
[Atmosphere](https://atmosphere.meteor.com/package/leaflet-gps)

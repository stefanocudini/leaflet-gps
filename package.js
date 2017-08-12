
Package.describe({
	summary: "Leaflet Control plugin for tracking gps position, with more options",
	name: "stefcud:leaflet-gps",
	version: "1.7.0",
	git: "https://github.com/stefanocudini/leaflet-gps.git"
});

Package.onUse(function (api, where) {
	api.addFiles('dist/leaflet-gps.min.js', 'client');
	api.addFiles('dist/leaflet-gps.min.css', 'client');
	//TODO add CSS  for meteor package
	api.addAssets('images/gps-icon.png', 'client');
});

Package.describe({
	summary: "Leaflet Control plugin for tracking gps position, with more options",
	name: "stefcud:leaflet-gps",
	version: "1.0.2",
	summary: "Leaflet Control GPS",
	git: "https://github.com/stefanocudini/leaflet-gps.git"
});

Package.on_use(function (api, where) {
	api.addFiles('dist/leaflet-gps.min.js', 'client');
	api.addFiles('dist/leaflet-gps.min.css', 'client');
	api.addFiles('images/gps-icon.png', 'client');
});

Package.describe({
	summary: "Leaflet Control GPS"
});

Package.on_use(function (api, where) {
	api.add_files('dist/leaflet-gps.min.js', 'client');
	api.add_files('dist/leaflet-gps.min.css', 'client');
	api.add_files('images/gps-icon.png', 'client');
});

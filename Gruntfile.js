'use strict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-todos');

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	meta: {
		banner:
		'/* \n'+
		' * Leaflet Control GPS v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n'+
		' * \n'+
		' * Copyright 2014 <%= pkg.author.name %> \n'+
		' * <%= pkg.author.email %> \n'+
		' * <%= pkg.author.url %> \n'+
		' * \n'+
		' * Licensed under the <%= pkg.license %> license. \n'+
		' * \n'+
		' * Demos: \n'+
		' * <%= pkg.homepage %> \n'+
		' * \n'+
		' * Source: \n'+
		' * <%= pkg.repository.url %> \n'+
		' * \n'+
		' */\n'
	},
	clean: {
		dist: {
			src: ['dist/*']
		}
	},
	jshint: {
		options: {
			globals: {
				console: true,
				module: true
			},
			"-W099": true,	//ignora tabs e space warning
			"-W033": true,
			"-W044": true	//ignore regexp
		},
		files: ['src/*.js']
	},
	concat: {
		//TODO cut out SearchMarker
		options: {
			banner: '<%= meta.banner %>'
		},
		dist: {
			files: {
				'dist/leaflet-gps.src.js': ['src/leaflet-gps.js'],			
				'dist/leaflet-gps.src.css': ['src/leaflet-gps.css']
			}
		}
	},
	uglify: {
		options: {
			banner: '<%= meta.banner %>'
		},
		dist: {
			files: {
				'dist/leaflet-gps.min.js': ['dist/leaflet-gps.src.js']
			}
		}
	},
	cssmin: {
		combine: {
			files: {
				'dist/leaflet-gps.min.css': ['src/leaflet-gps.css']
			}
		},
		options: {
			banner: '<%= meta.banner %>'
		},
		minify: {
			expand: true,
			cwd: 'dist/',
			files: {
				'dist/leaflet-gps.min.css': ['src/leaflet-gps.css']
			}
		}
	},
	todos: {
		options: { verbose: false },
		TODO: ['src/*.js'],
	},	
	watch: {
		dist: {
			options: { livereload: true },
			files: ['src/*'],
			tasks: ['clean','concat','cssmin','jshint']
		}		
	}
});

grunt.registerTask('default', [
	'clean',
	'concat',	
	'cssmin',
	'jshint',
	'uglify',
	'todos'
]);

};
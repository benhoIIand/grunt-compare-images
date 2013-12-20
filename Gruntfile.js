/*
 * grunt-compare-images
 * https://github.com/hollandben/grunt-compare-images
 *
 * Copyright (c) 2013 Ben Holland
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp', 'comparison/difference']
        },

        // Configuration to be run (and then tested).
        compareImages: {
            default_options: {},
            with_options: {
                options: {
                    cwd: 'image-comparison',
                    sample: 's',
                    baseline: 'b',
                    difference: 'd'
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
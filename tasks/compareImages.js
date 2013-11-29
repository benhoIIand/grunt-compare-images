/*
 * grunt-compare-images
 * https://github.com/hollandben/grunt-compare-images
 *
 * Copyright (c) 2013 Ben Holland
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var path = require('path');
    var cp   = require("child_process");

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('compareImages', 'Compare two images and receive a difference back', function() {
        var defaults = {
            cwd: './images-comparison/',
            sample: 'sample',
            baseline: 'baseline',
            difference: 'difference',
            threshold: '100'
        };

        var options = grunt.util._.defaults(defaults, this.options());

        var done = this.async();

        var sampleDir     = path.normalize(options.cwd + options.sample);
        var baselineDir   = path.normalize(options.cwd + options.baseline);
        var differenceDir = path.normalize(options.cwd + options.difference);

        var samples = grunt.file.expand({
            cwd: sampleDir
        }, '**/*.{jpg,png,gif}');

        var errors = 0;

        grunt.util.async.forEach(samples, function(sample, cb) {
            var baseline = path.normalize(baselineDir + '/' + sample);
            var output   = path.normalize(differenceDir +'/'+ sample);

            sample = path.normalize(sampleDir + '/'+ sample);

            if (!grunt.file.exists(baseline)) {
                console.log('file doesnt exist: ', baseline);
                return false;
            }

            compareImages(baseline, sample, output, options.threshold, cb);
        }, function() {
            if(errors > 0) {
                console.log('##teamcity[buildStatus status="SUCCESS" text="IMAGES ARE VISIBLY DIFFERENT. Check artifacts or the build log for the results -->"]');
                done();
            }
        });

        function compareImages(baseline, sample, output, threshold, cb) {
            var exePath = path.normalize(__dirname + '/lib/perceptualdiff.exe');

            var filename = path.basename(sample);

            // Create directory
            var outputDir = output.split(path.sep);
            outputDir.pop();
            outputDir = outputDir.join(path.sep);
            grunt.file.mkdir(path.normalize(options.cwd +'/'+ outputDir));

            // Get the absolute paths
            baseline = path.resolve(baseline);
            sample   = path.resolve(sample);
            output   = path.resolve(outputDir) +'/'+ filename;

            var args = '"'+ baseline +'" "'+ sample +'" -output "'+ output +'" -threshold "'+ threshold +'" -verbose';

            cp.exec([exePath, args].join(' '), function (err, stdout, stderr) {
                if(err) {
                    errors++;
                }
                cb();
            });
        }
    });

};
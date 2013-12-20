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

    grunt.registerMultiTask('compareImages', 'Compare two images and receive a difference back', function() {

        var options = this.options({
            cwd: './comparison/',
            sample: 'sample',
            baseline: 'baseline',
            difference: 'difference',
            threshold: '100'
        });

        var done = this.async();

        var sampleDir     = path.normalize(options.cwd +'/'+ options.sample);
        var baselineDir   = path.normalize(options.cwd +'/'+ options.baseline);
        var differenceDir = path.normalize(options.cwd +'/'+ options.difference);

        var samples = grunt.file.expand({
            cwd: sampleDir
        }, '**/*.{jpg,png,gif}');

        grunt.util.async.forEach(samples, function(sample, cb) {
            var baseline = path.normalize(baselineDir + '/' + sample);
            var output   = path.normalize(differenceDir +'/'+ sample);

            sample = path.normalize(sampleDir + '/'+ sample);

            if (!grunt.file.exists(baseline)) {
                grunt.verbose.writeln('File doesnt exist: ', baseline);
                cb();
                return false;
            }

            // Create directory
            var outputDir = output.split(path.sep);
            outputDir.pop();
            outputDir = outputDir.join(path.sep);

            grunt.file.mkdir(path.normalize(outputDir));

            var filename = path.basename(sample);
            var exePath  = path.normalize(__dirname + '/lib/perceptualdiff.exe');

            // Get the absolute paths
            var baselineAbsolute = path.resolve(baseline);
            var sampleAbsolute   = path.resolve(sample);
            var outputAbsolute   = path.resolve(outputDir) +'/'+ filename;

            var args = '"'+ baselineAbsolute +'" "'+ sampleAbsolute +'" -output "'+ outputAbsolute +'" -threshold "'+ options.threshold +'" -verbose';

            grunt.verbose.writeln('Comparing:', sample, 'to', baseline);

            cp.exec([exePath, args].join(' '), function (err, stdout, stderr) {
                if(err) {
                    grunt.log.writeln('There was a difference with the file:', sample);
                    grunt.log.writeln("##teamcity[buildStatus status='SUCCESS' text='IMAGES ARE VISIBLY DIFFERENT. Check artifacts or the build log for the results -->']");
                } else {
                    grunt.file.delete(baseline);
                    grunt.file.delete(sample);
                }

                cb();
            });
        }, done);
    });

};

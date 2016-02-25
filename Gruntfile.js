module.exports = function (grunt) {
    'use strict';

    var globalConfig = {
        src: 'src',
        dest: 'dist',
        projectDomain: 'skeleton.loc',
        timestamp: Date.now(),
        jsVendorFiles: [
            '<%= globalConfig.src %>/js/vendor/jquery.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/transition.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/alert.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/button.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/carousel.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/collapse.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/dropdown.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/modal.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/tooltip.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/popover.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/scrollspy.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/tab.js',
            //'<%= globalConfig.src %>/js/vendor/bootstrap/affix.js',
            '<%= globalConfig.src %>/js/vendor/media.match.js',
            '<%= globalConfig.src %>/js/vendor/enquire.js',
            '<%= globalConfig.src %>/js/vendor/*.js', // include all other files from vendor directory
            '!<%= globalConfig.src %>/js/vendor/modernizr.js' // exclude modernizr (it's in the header)
        ]
    };

    grunt.initConfig({
        globalConfig: globalConfig,
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                '<%= globalConfig.src %>/js/*.js',
                'Gruntfile.js'
            ]
        },
        clean: {
            pages: ['<%= globalConfig.dest %>/pages/**/*.html'],
            js: ['<%= globalConfig.dest %>/js/**/*.js', '<%= globalConfig.dest %>/js/**/*.map'],
            css: ['<%= globalConfig.dest %>/css/**/*.css', '<%= globalConfig.dest %>/css/**/*.map'],
            images: ['<%= globalConfig.dest %>/images/**/*.{png,jpg,gif}', '<%= globalConfig.dest %>/images-content/**/*.{png,jpg,gif}']
        },
        assemble: {
            options: {
                layoutdir: '<%= globalConfig.src %>/templates/layouts',
                flatten: true,
                layout: 'default.hbs',
                partials: '<%= globalConfig.src %>/templates/partials/*.hbs'
            },
            page: {
                files: {
                    '<%= globalConfig.dest %>/pages/': ['<%= globalConfig.src %>/templates/pages/*.hbs']
                }
            }
        },
        concat: {
            options: {
                sourceMap: true
            },
            vendor: {
                files: {
                    '<%= globalConfig.dest %>/js/modernizr.js': '<%= globalConfig.src %>/js/vendor/modernizr.js',
                    '<%= globalConfig.dest %>/js/vendor.js': globalConfig.jsVendorFiles
                }
            },
            app: {
                files: {
                    '<%= globalConfig.dest %>/js/app.js': ['<%= globalConfig.src %>/js/*.js']
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: false,
                    beautify: false,
                    preserveComments: /^!|@preserve|@license|@cc_on/i,
                    sourceMap: true
                },
                files: {
                    '<%= globalConfig.dest %>/js/modernizr.js': '<%= globalConfig.src %>/js/vendor/modernizr.js',
                    '<%= globalConfig.dest %>/js/vendor.js': globalConfig.jsVendorFiles,
                    '<%= globalConfig.dest %>/js/app.js': '<%= globalConfig.src %>/js/*.js'
                }
            }
        },
        sass: {
            dev: {
                options: {
                    sourceMap: true,
                    outputStyle: 'expanded'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= globalConfig.src %>/sass',
                        src: ['**/*.scss'],
                        dest: '<%= globalConfig.dest %>/css',
                        ext: '.css'
                    }
                ]
            },
            dist: {
                options: {
                    sourceMap: true,
                    outputStyle: 'compressed'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= globalConfig.src %>/sass',
                        src: ['**/*.scss'],
                        dest: '<%= globalConfig.dest %>/css',
                        ext: '.css'
                    }
                ]
            }
        },
        imagemin: {
            images: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.src %>/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= globalConfig.dest %>/images/'
                }]
            },
            'images-content': {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.src %>/images-content',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= globalConfig.dest %>/images-content/'
                }]
            }
        },
        sprite: {
            all: {
                src: '<%= globalConfig.dest %>/images/sprites/*.{png,jpg,gif}',
                destCss: '<%= globalConfig.src %>/sass/_base/_sprites.scss',
                dest: '<%= globalConfig.dest %>/images/sprites.png',
                imgPath: '../images/sprites.png?v=<%= globalConfig.timestamp %>',
                'cssVarMap': function (sprite) {
                    var str = sprite.name,
                        res = str.split("_"),
                        spritePrefix = 'sprite-';

                    if (res[res.length - 1] === 'hover') {
                        sprite.name = spritePrefix + res.slice(0, -1).join("_") + '.sprite--active';
                    } else {
                        sprite.name = spritePrefix + sprite.name;
                    }
                }
            }
        },
        postcss: {
            options: {
                map: {
                    inline: false // save all sourcemaps as separate files
                },
                processors: [
                    require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'], remove: false})
                ]
            },
            dist: {
                src: '<%= globalConfig.dest %>/css/**/*.css'
            }
        },
        watch: {
            options: {
                spawn: false
            },
            assemble: {
                files: ['<%= globalConfig.src %>/templates/**/*.hbs'],
                tasks: ['clean:pages', 'assemble']
            },
            images: {
                files: ['<%= globalConfig.src %>/images/**/*.{png,jpg,gif}', '<%= globalConfig.src %>/images-content/**/*.{png,jpg,gif}'],
                tasks: ['clean:images', 'imagemin', 'sprite', 'sass:dev', 'postcss']
            },
            'concat-app': {
                files: ['<%= globalConfig.src %>/js/*.js'],
                tasks: ['jshint', 'concat:app']
            },
            'concat-vendor': {
                files: ['<%= globalConfig.src %>/js/vendor/**/*.js'],
                tasks: ['concat:vendor']
            },
            sass: {
                files: ['<%= globalConfig.src %>/sass/**/*.scss'],
                tasks: ['clean:css', 'sass:dev', 'postcss']
            }
        },
        browserSync: {
            bsFiles: {
                src : [
                    '<%= globalConfig.dest %>/css/*.css',
                    '<%= globalConfig.dest %>/js/*.js',
                    '<%= globalConfig.dest %>/pages/*.html'
                ]
            },
            options: {
                watchTask: true,
                proxy: '<%= globalConfig.projectDomain %>'
            }
        }
    });

    /* load every plugin in package.json */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browser-sync');

    /* grunt tasks */
    grunt.registerTask('default', [
        'jshint',
        'clean',
        'assemble',
        'concat',
        'imagemin',
        'sprite',
        'sass:dev',
        'postcss',
        'browserSync',
        'watch'
    ]);
    grunt.registerTask('build', [
        'jshint',
        'clean',
        'assemble',
        'uglify:dist',
        'imagemin',
        'sprite',
        'sass:dist',
        'postcss'
    ]);

};
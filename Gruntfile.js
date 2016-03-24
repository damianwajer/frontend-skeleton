module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        globalConfig: {
            src: 'src',
            dest: 'dist',
            timestamp: Date.now()
        },
        manifest: grunt.file.readJSON('src/manifest.json'),
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
                    '<%= globalConfig.dest %>/js/vendors.header.lib.js': '<%= manifest.dependencies.jsVendorHeaderFiles %>',
                    '<%= globalConfig.dest %>/js/vendors.footer.lib.js': '<%= manifest.dependencies.jsVendorFooterFiles %>'
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
                    '<%= globalConfig.dest %>/js/vendors.header.lib.js': '<%= manifest.dependencies.jsVendorHeaderFiles %>',
                    '<%= globalConfig.dest %>/js/vendors.footer.lib.js': '<%= manifest.dependencies.jsVendorFooterFiles %>',
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
            config: {
                options: {
                    spawn: false
                },
                files: ['<%= globalConfig.src %>/manifest.json'],
                tasks: ['updateConfig', 'concat:vendor']
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
                server: {
                    baseDir: "./"
                }
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

    /* Grunt development task */
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

    /* Grunt production task */
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

    /* Update Grunt config */
    grunt.registerTask('updateConfig', function () {
        grunt.config.set('manifest', grunt.file.readJSON(grunt.config.get('globalConfig.src') + '/manifest.json'));
    });
};
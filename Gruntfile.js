module.exports = function (grunt) {
  'use strict';

  // Load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    globalConfig: {
      root: './',
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
      fonts: ['<%= globalConfig.dest %>/fonts/**'],
      images: ['<%= globalConfig.dest %>/images/**/*.{png,jpg,gif,svg}', '<%= globalConfig.dest %>/images-content/**/*.{png,jpg,gif,svg}']
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
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: {
          '<%= globalConfig.dest %>/js/app.js': '<%= globalConfig.src %>/js/app.js'
        }
      }
    },
    browserify: {
      options: {
        transform: [["babelify", {"presets": ["@babel/preset-env"]}]]
      },
      dev: {
        options: {
          browserifyOptions: {
            debug: true
          },
        },
        files: {
          '<%= globalConfig.dest %>/js/app.js': '<%= globalConfig.src %>/js/app.js'
        }
      },
      dist: {
        options: {
          browserifyOptions: {
            debug: false
          },
        },
        files: {
          '<%= globalConfig.dest %>/js/app.js': '<%= globalConfig.src %>/js/app.js'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          mangle: false,
          beautify: false,
          preserveComments: /^!|@preserve|@license|@cc_on/i,
          sourceMap: false
        },
        files: {
          '<%= globalConfig.dest %>/js/vendors.header.lib.js': '<%= manifest.dependencies.jsVendorHeaderFiles %>',
          '<%= globalConfig.dest %>/js/vendors.footer.lib.js': '<%= manifest.dependencies.jsVendorFooterFiles %>',
          '<%= globalConfig.dest %>/js/app.js': '<%= globalConfig.dest %>/js/app.js'
        }
      }
    },
    sass: {
      options: {
        implementation: require('node-sass'),
        sourceMap: true
      },
      dev: {
        options: {
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
          src: ['**/*.{png,jpg,gif,svg}'],
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
          src: ['**/*.{png,jpg,gif,svg}'],
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
        padding: 2,
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
          require('autoprefixer')({
            remove: false
          })
        ]
      },
      dist: {
        src: '<%= globalConfig.dest %>/css/**/*.css'
      }
    },
    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: '<%= globalConfig.src %>/',
            src: ['fonts/**'],
            dest: '<%= globalConfig.dest %>/'
          }
        ]
      }
    },
    to_html: {
      build: {
        options: {
          generatePage: true,
          useFileNameAsTitle: true,
          rootDirectory: '<%= globalConfig.dest %>/pages',
          template: grunt.file.read('src/templates/listing.hbs'),
          templatingLanguage: 'handlebars'

        },
        files: {
          '<%= globalConfig.dest %>/index.html': '<%= globalConfig.dest %>/pages/*.html'
        }
      }
    },
    watch: {
      options: {
        spawn: true
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
        tasks: ['clean:pages', 'assemble', 'to_html']
      },
      images: {
        files: ['<%= globalConfig.src %>/images/**/*.{png,jpg,gif,svg}', '<%= globalConfig.src %>/images-content/**/*.{png,jpg,gif,svg}'],
        tasks: ['clean:images', 'imagemin', 'sprite', 'sass:dev', 'postcss']
      },
      'concat-app': {
        files: ['<%= globalConfig.src %>/js/app.js', '<%= globalConfig.src %>/js/modules/*.js'],
        tasks: ['jshint', 'browserify:dev']
      },
      'concat-vendor': {
        files: ['<%= globalConfig.src %>/js/vendor/**/*.js'],
        tasks: ['concat:vendor']
      },
      sass: {
        files: ['<%= globalConfig.src %>/sass/**/*.scss'],
        tasks: ['clean:css', 'sass:dev', 'postcss']
      },
      fonts: {
        files: ['<%= globalConfig.src %>/fonts/**'],
        tasks: ['clean:fonts', 'copy:fonts']
      }
    },
    browserSync: {
      bsFiles: {
        src: [
          '<%= globalConfig.dest %>/css/*.css',
          '<%= globalConfig.dest %>/js/*.js',
          '<%= globalConfig.dest %>/pages/*.html'
        ]
      },
      options: {
        reloadDelay: 500,
        watchTask: true,
        server: {
          baseDir: "./"
        }
      }
    }
  });

  // Grunt development task
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'copy',
    'assemble',
    'to_html',
    'concat',
    'imagemin',
    'sprite',
    'sass:dev',
    'postcss',
    'browserify:dev',
    'browserSync',
    'watch'
  ]);

  // Grunt production task
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'copy',
    'assemble',
    'to_html',
    'imagemin',
    'sprite',
    'sass:dist',
    'postcss',
    'browserify:dist',
    'uglify:dist'
  ]);

  // Update Grunt config
  grunt.registerTask('updateConfig', function () {
    grunt.config.set('manifest', grunt.file.readJSON(grunt.config.get('globalConfig.src') + '/manifest.json'));
  });
};

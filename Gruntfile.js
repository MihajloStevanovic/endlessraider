module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    sass: {                              // Task
      options: {
        sourcemap: 'none'
      },
      dist: {                            // Target
        files: [{                         // Dictionary of files
          expand: true,
          cwd: 'app/scss/',
          src: ['main.scss'],
          dest: 'app/styles/',
          ext: '.css'
        }]
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      sass: {
        files: ['**/*.scss'],
        tasks: ['sass']
      },
      scripts: {
        files: ['**/*.js']
      },
      html: {
        files: ['**/*.html']
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            '**/*.css',
            '**/*.html',
            '**/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: 'app/'
        }
      }
    }
  });

  // Load the plugin that provides the all tasks.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  // Default task(s).
  grunt.registerTask('default', [
    'sass',
    'browserSync',
    'watch'
  ]);

};
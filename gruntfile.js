module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  // grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-git-authors');

  grunt.initConfig({
    clean: ['client/flash.js', 'client/flash.js.map', 'test/test.js', 'test/test.js.map'],

    browserify: {
      plugin: {
        src: ['client/flash.coffee'],
        dest: 'client/flash.js',
        options: {
          transform: ['coffeeify'],
          browserifyOptions: {
            extensions: ".coffee"
          }
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },


    watch: {
      all: {
        files: ['client/*.coffee', 'test/*.coffee', 'server/*.coffee'],
        tasks: ['build']
      }
    }
  });

  grunt.registerTask('build', ['clean', 'mochaTest', 'browserify']);
  grunt.registerTask('default', ['build']);

};

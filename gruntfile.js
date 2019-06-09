module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  // grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-git-authors');

  grunt.initConfig({
    clean: ['client/zones.js', 'client/zones.js.map', 'test/test.js', 'test/test.js.map'],

    browserify: {
      plugin: {
        src: ['client/zones.coffee'],
        dest: 'client/zones.js',
        options: {
          transform: [[ 'coffeeify', { transpile: { presets: ['@babel/preset-env'] } } ]],
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

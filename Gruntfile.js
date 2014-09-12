module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
      compass: {
        files: "./assets/scss/**/*.scss",
        tasks: "compass:dist",
        options: {
          interrupt: true
        }
      },
      concat_app: {
        files: "./assets/js/**/*",
        tasks: "concat:app"
      },
      templates: {
        files: "./assets/templates/**/*",
        tasks: "jsttojs:templates"
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: './assets/scss/',
          cssDir: './public/css/',
          imagesDir: './public/img/'
        }
      }
    },
    concat: {
      vendor: {
        src: [
          "./bower_components/modernizr/modernizr.js",
          "./bower_components/jquery/dist/jquery.js",
          "./bower_components/underscore/underscore.js",
          "./bower_components/backbone/backbone.js",
          "./bower_components/backbone.marionette/lib/backbone.marionette.js",
          "./bower_components/ejs/ejs.js"
          ],
        dest: "./public/js/vendors.js"
      },
      app: {
        src: "./assets/js/**/*.js",
        dest: "./public/js/app.js"
      },
      css: {
        src: [
          "./bower_components/bootstrap/dist/css/bootstrap.css"
        ],
        dest: "./public/css/vendors.css"
      }
    },
    jsttojs: {
      root: "./assets/templates",
      output: "public/js/templates.js",
      ext: "ejs",
      name: "TWM.templates",
      removebreak: true
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-jsttojs");

  grunt.registerTask("build", ["jsttojs", "concat:vendor", "concat:app", "concat:css", "compass:dist"]);
  grunt.registerTask("default", ["build", "watch"]);
}
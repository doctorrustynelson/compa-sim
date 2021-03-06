/**
 * Test and Validation file.
 */

'use strict';

module.exports = function( grunt ){

	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'lib/**/*.js',
				'tests/**/*.js',
				'bin/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		nodeunit: {
			tests: [
				'tests/**/*tests.js'
			],
			compiler: [
				'tests/compiler-tests.js'
			],
			options: {
				reporter: 'verbose'
			}
		},
		
		coveralls: {
			submit_coverage: {
				src: 'coverage/lcov.info'
			}
		}
	});
	
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
	grunt.loadNpmTasks( 'grunt-coveralls' );
	
	grunt.registerTask( 'test', [ 'jshint', 'nodeunit:tests' ] );
	grunt.registerTask( 'default', [ 'test' ] );
};

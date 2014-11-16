/**
 * Logger definition.
 */

'use strict';

var chalk = require( 'chalk' );

module.exports = function( log_level ){
	return {
		debug: function( anything ){
			if( log_level === 'DEBUG' || log_level === 'ALL' ){
				console.log( chalk.cyan( 'systematic [DEBUG] ' ) + anything );
			}
		},
		info: function( anything ){
			if( log_level === 'DEBUG' || log_level === 'INFO' || log_level === 'ALL' ){
				console.log( chalk.green( 'systematic [INFO]  ' ) + anything );
			}
		},
		warn: function( anything ){
			if( log_level === 'DEBUG' || log_level === 'INFO' || log_level === 'WARN' || log_level === 'ALL' ){
				console.log( chalk.yellow( 'systematic [WARN]  ' + anything ) );
			}
		},
		error: function( anything ){
			if( log_level === 'DEBUG' || log_level === 'WARN' || log_level === 'INFO' || log_level === 'ERROR' || log_level === 'ALL' ){
				console.log( chalk.red( 'systematic [ERROR] ' + anything ) );
			}
		}
	};
};
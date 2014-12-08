/**
 * New node file
 */

var fs = require( 'fs' );
var path = require( 'path' );

var config = require( './configs/rnn2102-v2' );
var raw_program = fs.readFileSync( path.join( __dirname, 'assembly', 'bubblesort' ) );

var Simulator = require( '../lib/core' );

var compiled_program = Simulator.compile( config, raw_program.toString().split( /\r?\n/ ) );

config.memory_init = {
	0x7fff: [
	     10
	],
	0x8000: [
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	     Math.floor(Math.random() * 0x0100),
	]
};
config.program = compiled_program;
var result;
config.instructions['88'].run = function( status ){
	this.exit( 0 );
	result = status.memory.slice( 0x8000, 0x8000 + 10 );
};
config.post_processors = [];
//config.post_processors.push( Simulator.printState );

console.log( config.memory_init[ 0x8000 ] );

var core = new Simulator( config );

core.run();

console.log( result );

module.exports = result;
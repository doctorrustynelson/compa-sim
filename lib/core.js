
'use strict';

var LOGGER = require( './utils/logger' )( 'ALL', 'compa' );
var Table = require( 'cli-table' );
require( './utils/binary-utils' );

function convertProgram( program, byte_length ){
	var result = [];
	program.forEach( function( line ){
		while( line.indexOf( ' ' ) !== -1 )
			line = line.replace( /\s+/, '' );
		for( var i = 0; i < Math.floor( line.length / byte_length ); ++i ){
			result.push( line.substr( i * byte_length, byte_length ).binaryToNumber() );
		}
	});
	return result;
}

function printState( config, state ){
	var t = new Table({style: { head: [ ], border: ['cyan'] }, colWidths: [ 25, 20, 20 ] });
	t.push([ 'Instruction Pointer', state.old_pc, '' ]);
	
	var instruction = state.memory[ state.old_pc ];

	var interpertation = '';
	
	var op_code = ( instruction >>> ( config.byte_length - config.operator_length ) ).truncate( config.operator_length ).toHexString( Math.log(config.byte_length) / Math.log(4) ).toUpperCase();
	
	var operation = config.instructions[ op_code ]
	
	var rest = instruction.truncate( config.byte_length - config.operator_length );
	
	var index = 0;
	for( index = 1; index < ( operation.length / config.byte_length ); ++index ){
		rest = ( ( rest << config.byte_length ) | state.memory[ state.old_pc + index ] );
	}
	
	LOGGER.debug('Interperting Instruction: ' + operation.name + ' ' + rest.toBinaryString( operation.length - config.operator_length ) );
	
	interpertation = operation.name;
	
	var number_of_registers = operation.number_of_registers;
	for( var i = 0; i < number_of_registers; ++i ){
		var register = ( rest >>> ( operation.length - ( config.operator_length + ( i + 1 ) * config.register_length ) ) ).truncate( config.register_length ).toHexString();
		interpertation = interpertation + ' R' + register; 
	}
	
	var raw_value = operation.raw_value;
	if( raw_value ){
		var value = ( rest >>> ( operation.length - ( config.operator_length + operation.number_of_registers * config.register_length + operation.raw_value_length )  )  ).truncate( operation.raw_value_length ).toHexString();
		interpertation = interpertation + ' 0x' + value;
	}
	
	t.push([ 'Instruction Buffer', '0x' + op_code + ' 0x' + rest.toHexString() , interpertation.toString() ]);
	
	state.registers.forEach( function( register, index ){
		t.push([ 'R' + index.toHexString(), '0b' + register.toBinaryString( config.byte_size ), '0x' + register.toHexString( ) ]);
	});
	
	config.flags.forEach( function( flag ){
		t.push([ flag, ( state[flag] ? 1 : 0 ), state[flag] ]);
	} )
	
	t.push([ 'Next PC', state.pc, '' ]);
	
	console.log( t.toString() );
}

function Core( config ){
	var instructions = config.instructions;
	var operator_length = config.operator_length;
	var register_length = config.register_length;
	var num_registers = config.num_registers;
	var memory_size = config.memory_size;
	var memory_init = config.memory_init || {};
	var byte_length = config.byte_length;
	var post_processors = config.post_processors || [];
	var unimplemented = config.unimplemented_instruction || function( op_code, status ){
		status = status;
		throw new Error( 'Unimplemented Instruction: ' + op_code ); 
	};
	var flags = config.flags || [];
	var exit = false;
	
	var index;
	
	var state = {
		pc: 0,
		old_pc: 0,
		memory: new Array( memory_size ),
		registers: new Array(num_registers),
	};
	
	flags.forEach( function( flag ){
		state[flag] = false;
	} );
	
	var program = convertProgram( config.program, byte_length );
	for( index = 0; index < memory_size; ++index ){
		if( index < program.length ){
			state.memory[ index ] = program[ index ];
		} else {
			state.memory[ index ] = 0;
		}
	}
	
	Object.keys( memory_init ).forEach( function( start_address ){
		start_address = parseInt( start_address );
		for( index = 0; index < memory_init[ start_address ].length; ++index ){
			state.memory[ start_address + index ] = memory_init[ start_address ][ index ];
			LOGGER.debug( Number( start_address + index ).toHexString() + ' <- ' + ( state.memory[ start_address + index ] ).toHexString() );
		}
	} );
	
	for( index = 0; index < num_registers; ++index ){
		state.registers[ index ] = 0;
	}
	
	this.canStep = function(){
		return !exit && ( state.pc < state.memory.length && state.pc >= 0 );
	};
	
	this.run = function(){
		while( this.canStep() ){
			this.step();
		}
		return state.registers[0];
	};
	
	this.isNegative = function( value ){
		return ( ( value & ( 1 << ( byte_length - 1 ) ) ) !== 0 );
	};
	
	this.truncate = function( value ){
		return value.truncate( byte_length );
	};
	
	this.exit = function( value ){
		state.registers[ 0 ] = value;
		exit = true;
	};
	
	this.step = function(){
		
		// Read Instruction
		state.old_pc = state.pc;
		var instruction = state.memory[ state.pc ];
		
		// Determine Op Code
		var op_code = ( instruction >>> ( byte_length - operator_length ) ).truncate( operator_length ).toHexString( Math.log(byte_length) / Math.log(4) ).toUpperCase();
		
		var rest = instruction.truncate( config.byte_length - config.operator_length );
		
		// Get the Operation to run
		var operation = instructions[ op_code ];

		// Handle unimplemented instruction
		if( operation === undefined )
			unimplemented( op_code, state );
		
		
		// Pull down extra bytes if needed for the instruction.
		var index = 0;
		for( index = 1; index < ( operation.length / byte_length ); ++index ){
			rest = ( ( rest << byte_length ) | state.memory[ state.pc + index ] );
		}
	 
		LOGGER.debug( 'Executing Operation: ' + operation.name + ' ( 0x' + op_code + ' )' );
		
		// Determine the Registers
		var number_of_registers = operation.number_of_registers;
		var rs = [];
		for( var i = 0; i < number_of_registers; ++i ){
			rs.push(( rest >>> ( operation.length - ( operator_length + ( i + 1 ) * register_length )  ) ).truncate( register_length ));
		}
		
		// Determine the Value
		var raw_value = null;
		if( operation.raw_value ){
			raw_value = ( rest >>> ( operation.length - ( operator_length + operation.number_of_registers * config.register_length + operation.raw_value_length )  )  ).truncate( operation.raw_value_length );
		}
		
		// Arrange Inputs to Operation
		var inputs = [];
		inputs.push( state );
		rs.forEach( function( r ){
			inputs.push( r );
		});
		inputs.push( raw_value ); 
		
		// Run The Operation
		operation.run.apply( this, inputs );
		
		// Increment Instruction Pointer
		if( state.pc === state.old_pc ){
			state.pc = state.pc + ( operation.length / byte_length );
		}
		
		// Run all post processors
		post_processors.forEach( function( processor ){
			processor( config, state );
		} );
	};
	
	this.printState = printState;
	
	LOGGER.info( 'Systematic Core Ready.' );
}

Core.printState = printState;
Core.compile = require( './compiler' );

module.exports = Core;
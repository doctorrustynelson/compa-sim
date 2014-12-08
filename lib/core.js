
'use strict';

var LOGGER = require( './utils/logger' )( 'ALL', 'compa' );
var Table = require( 'cli-table' );
require( './utils/binary-utils' );

function convertProgram( program ){
	return program.map( function( line ){
		return line.replace( /\s/, '' ).binaryToNumber();
	});
}

function interpertInstruction( config, instruction ){
	LOGGER.debug('Interperting Instruction: ' + instruction.toBinaryString());
	var interpertation = '';
	
	var op_code = ( instruction >>> ( config.byte_length - config.operator_length ) ).truncate( config.operator_length ).toHexString();
	interpertation = config.instructions[ op_code ].name;
	
	var number_of_registers = config.instructions[ op_code ].number_of_registers;
	for( var i = 0; i < number_of_registers; ++i ){
		var register = ( instruction >>> ( config.byte_length - ( config.operator_length + ( i + 1 ) * config.register_length ) ) ).truncate( config.register_length ).toHexString();
		interpertation = interpertation + ' R' + register; 
	}
	
	var raw_value = config.instructions[ op_code ].raw_value;
	if( raw_value ){
		var value = instruction.truncate( config.byte_length - ( config.operator_length + config.number_of_registers * config.register_length ) ).toBinaryString();
		interpertation = interpertation + ' 0b' + value;
	}

	return interpertation;
}

function printState( config, state ){
	var t = new Table({style: { head: [ ], border: ['cyan'] }, colWidths: [ 25, 20, 20 ] });
	t.push([ 'Instruction Pointer', state.old_pc, '' ]);
	
	var instruction = state.memory[ state.old_pc ];
	t.push([ 'Instruction Buffer', '0b' + instruction.toBinaryString( config.instruction_length ), interpertInstruction( config, instruction ).toString() ]);
	
	state.registers.forEach( function( register, index ){
		t.push([ 'R' + index.toHexString(), '0b' + register.toBinaryString( config.byte_size ), '0x' + register.toHexString( ) ]);
	});
	
	t.push([ 'Next PC', state.pc, '' ]);
	
	console.log( t.toString() );
}

function Core( config ){
	var instructions = config.instructions;
	var operator_length = config.operator_length;
	var register_length = config.register_length;
	var num_registers = config.num_registers;
	var memory_size = config.memory_size;
	var memory_init = config.memory_init || [];
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
	
	var program = convertProgram( config.program );
	for( index = 0; index < memory_size; ++index ){
		if( index < program.length ){
			state.memory[ index ] = program[ index ];
		} else if( memory_size - index <= memory_init.length ){
			state.memory[ index ] = memory_init[ memory_size - ( index + 1 ) ];
		} else {
			state.memory[ index ] = 0;
		}
	}
	
	for( index = 0; index < num_registers; ++index ){
		state.registers[ index ] = 0;
	}
	
	this.canStep = function(){
		return exit || ( state.pc < state.memory.length && state.pc >= 0 );
	};
	
	this.run = function(){
		while( this.canStep() ){
			this.step();
		}
		return state.registers[0];
	};
	
	this.isNegative = function( value ){
		return ( ( value && ( 1 << ( byte_length - 1) ) ) !== 0 );
	};
	
	this.turncate = function( value ){
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
		var op_code = ( instruction >>> ( byte_length - operator_length ) ).truncate( operator_length ).toHexString();
		
		// Get the Operation to run
		var operation = instructions[ op_code ];

		// Handle unimplemented instruction
		if( operation === undefined )
			unimplemented( op_code, state );
		
		
		// Pull down extra bytes if needed for the instruction.
		var index = 0;
		for( index = 1; index < ( operation.length / byte_length ); ++i ){
			instruction = ( ( instruction << byte_length ) & state.memory[ state.pc + i ] );
		}
	 
		LOGGER.debug( 'Executing Operation: ' + operation.name + ' ( 0x' + op_code + ' )' );
		
		// Determine the Registers
		var number_of_registers = operation.number_of_registers;
		var rs = [];
		for( var i = 0; i < number_of_registers; ++i ){
			rs.push(( instruction >>> ( operation.length - ( operator_length + ( i + 1 ) * register_length )  ) ).truncate( register_length ));
		}
		
		// Determine the Value
		var raw_value = null;
		if( operation.raw_value ){
			raw_value = instruction.truncate( operation.length - ( operator_length + number_of_registers * register_length ) );
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

module.exports = Core;
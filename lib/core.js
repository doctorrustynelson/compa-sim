
'use strict';

var LOGGER = require( './logger' )( 'ALL' );
var Table = require( 'cli-table' );
require( './binary-utils' );

var num_registers = 0;
var registers = [];
var instructions = [];
var program = [];
var instruction_length = 0;
var register_length = 0;
var register_size = 0;
var operator_length = 0;
var instruction_pointer = 0;

function convertProgram( program ){
	return program.map( function( line ){
		return line.replace( /\s/, '' ).binaryToNumber();
	});
}

function interpertInstruction( instruction ){
	LOGGER.debug('Interperting Instruction: ' + instruction.toBinaryString());
	var interpertation = '';
	
	var op_code = ( instruction >>> ( instruction_length - operator_length ) ).truncate( operator_length ).toHexString();
	interpertation = instructions[ op_code ].name;
	
	var number_of_registers = instructions[ op_code ].number_of_registers;
	for( var i = 0; i < number_of_registers; ++i ){
		var register = ( instruction >>> ( instruction_length - ( operator_length + ( i + 1 ) * register_length ) ) ).truncate( register_length ).toHexString();
		interpertation = interpertation + ' R' + register; 
	}
	
	var raw_value = instructions[ op_code ].raw_value;
	if( raw_value ){
		var value = instruction.truncate( instruction_length - ( operator_length + number_of_registers * register_length ) ).toBinaryString();
		interpertation = interpertation + ' 0b' + value;
	}

	return interpertation;
}

function Core( config ){
	instructions = config.instructions;
	program = convertProgram( config.program );
	instruction_length = config.instruction_length;
	operator_length = config.operator_length;
	register_length = config.register_length;
	register_size = config.register_size;
	num_registers = config.num_registers;
	registers = new Array(num_registers);
	for( var i = 0; i < num_registers; ++i ){
		registers[i] = 0;
	}
	
	LOGGER.info( 'Systematic Core Ready.' );
}

Core.prototype.step = function(){
	
	// Read Instruction
	var instruction = program[instruction_pointer];
	
	// Determine Op Code
	var op_code = ( instruction >>> ( instruction_length - operator_length ) ).truncate( operator_length ).toHexString();
	LOGGER.debug( 'Executing Operation: ' + instructions[ op_code ].name + ' ( 0x' + op_code + ' )' );
	
	// Get the Operation to run
	var operation = instructions[ op_code ];
	
	// Determine the Registers
	var number_of_registers = operation.number_of_registers;
	var rs = [];
	for( var i = 0; i < number_of_registers; ++i ){
		rs.push(( instruction >>> ( instruction_length - ( operator_length + ( i + 1 ) * register_length )  ) ).truncate( register_length ));
	}
	
	// Determine the Value
	var raw_value = null;
	if( operation.raw_value ){
		raw_value = instruction.truncate( instruction_length - ( operator_length + number_of_registers * register_length ) );
	}
	
	// Arrange Inputs to Operation
	var inputs = [];
	inputs.push( registers );
	rs.forEach( function( r ){
		inputs.push( r );
	});
	inputs.push( raw_value ); 
	
	// Run The Operation
	operation.run.apply( this, inputs );
	
	// Print State
	this.printState();
	
	// Increment Instruction Pointer
	++instruction_pointer;
};

Core.prototype.canStep = function(){
	return instruction_pointer < program.length;
};

Core.prototype.run = function(){
	while( this.canStep() ){
		this.step();
	}
	return registers[0];
};

Core.prototype.printInstructions = function( ){
	var t = new Table({style: {head: [ '', 'Instruction', 'Hex Representation' ], border: ['cyan']}});
	instructions.forEach( function( instruction, index ){
		t.push([ index, instruction.name, instruction.hex ] );
	});
	
	console.log( t.toString() );
};

Core.prototype.printState = function( ){
	var t = new Table({style: { head: [ ], border: ['cyan'] }, colWidths: [ 25, 20, 20 ] });
	t.push([ 'Instruction Pointer', instruction_pointer, '' ]);
	
	var instruction = program[instruction_pointer];
	t.push([ 'Instruction Buffer', '0b' + instruction.toBinaryString( instruction_length ), interpertInstruction( instruction ).toString() ]);
	
	registers.forEach( function( register, index ){
		t.push([ 'R' + index.toHexString(), '0b' + register.toBinaryString( register_size ), '0x' + register.toHexString( ) ]);
	});
	
	console.log( t.toString() );
};

module.exports = Core;
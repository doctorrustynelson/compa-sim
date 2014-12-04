/**
 * New node file
 */

var Systematic = require( '../lib/core' );

var core = new Systematic({
	instructions: {
		'0': {
			name: 'ADD',
			number_of_registers: 3,
			raw_value: false,
			run: function( state, rr, ra, rb ){
				state.registers[rr] = state.registers[ra] + state.registers[rb];
			}
		},
		'1': {
			name: 'SUB',
			number_of_registers: 3,
			raw_value: false,
			run: function( state, rr, ra, rb ){
				state.registers[rr] = state.registers[ra] - state.registers[rb];
			}
		},
		'2': {
			name: 'INCR',
			number_of_registers: 1,
			raw_value: false,
			run: function( state, ra ){
				++state.registers[ra];
			}
		},
		'3': {
			name: 'DECR',
			number_of_registers: 1,
			raw_value: false,
			run: function( state, ra ){
				--state.registers[ra];
			}
		},
		'4': {
			name: 'AND',
			number_of_registers: 3,
			raw_value: false,
			run: function( state, rr, ra, rb ){
				state.registers[rr] = state.registers[ra] & state.registers[rb];
			}
		},
		'5': {
			name: 'OR',
			number_of_registers: 3,
			raw_value: false,
			run: function( state, rr, ra, rb ){
				state.registers[rr] = state.registers[ra] | state.registers[rb];
			}
		},
		'6': {
			name: 'NOT',
			number_of_registers: 0,
			raw_value: false,
			run: function( state, ra ){
				state.registers[ra] = ~state.registers[ra]; 
			}
		},
		'7': {
			name: 'XOR',
			number_of_registers: 3,
			raw_value: false,
			run: function( state, rr, ra, rb ){
				state.registers[rr] = state.registers[ra] ^ state.registers[rb];
			}
		},
		'8': {
			name: 'LOAD',
			number_of_registers: 1,
			raw_value: true,
			run: function( state, ra, value ){
				state.registers[ ra ] = value;
			}
		},
		'9': {
			name: 'RETURN',
			number_of_registers: 1,
			raw_value: false,
			run: function( state, ra ){
				state.registers[0] = state.registers[ra];
				state.pc = -1;
			}
		},
	},
	program: [
		'1000 001110101', // LOAD R1 with 0d53
		'1000 010000110', // LOAD R2 with 0d6
		'0000 011001010', // ADD R1 and R2 into R3 (d53 + d6 = d59)
		'0010 011000000', // INCR R3 (d59 + d1 = d60)
		'0100 001010011', // AND R2 and R3 into R1 ( b000110 & b111100 = b000100 )
		'0011 001000000', // DECR R1 (d4 - d1 = d3)
		'1001 001000000'  // STORE R1 into R0 (d3)
	],
	mem_size: 7,
	byte_length: 13,
	instruction_length: 13,
	operator_length: 4,
	register_length: 3,
	register_size: 6,
	num_registers: 8,
	post_processors: [
        Systematic.prototype.printState
	]
});

var result = core.run();
console.log( 'Result (in decimal) of Running program is: ' + result );

module.exports = result;


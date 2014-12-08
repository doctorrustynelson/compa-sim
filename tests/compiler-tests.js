
/* Node unit quick reference:
 * 
 *	ok(value, [message]) 
 *		- Tests if value is a true value.
 *	equal(actual, expected, [message]) 
 *		- Tests shallow, coercive equality with the equal comparison operator ( == ).
 *	notEqual(actual, expected, [message]) 
 *		- Tests shallow, coercive non-equality with the not equal comparison operator ( != ).
 *	deepEqual(actual, expected, [message]) 
 *		- Tests for deep equality.
 *	notDeepEqual(actual, expected, [message]) 
 *		- Tests for any deep inequality.
 *	strictEqual(actual, expected, [message]) 1
 *		- Tests strict equality, as determined by the strict equality operator ( === )
 *	notStrictEqual(actual, expected, [message]) 
 *		- Tests strict non-equality, as determined by the strict not equal operator ( !== )
 *	throws(block, [error], [message]) 
 *		- Expects block to throw an error.
 *	doesNotThrow(block, [error], [message]) 
 *		- Expects block not to throw an error.
 *	ifError(value) 
 *		- Tests if value is not a false value, throws if it is a true value.
 *	
 *	expect(amount) 
 *		- Specify how many assertions are expected to run within a test. 
 *	done() 
 *		- Finish the current test function, and move on to the next. ALL tests should call this!
 */

var compile = require( '../lib/compiler.js' );

module.exports.stringToNumberConversionTest = function( unit ){
	
	var result = compile( {
		instructions: {
			'0': {
				name: 'ADD',
				number_of_registers: 3,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, rr, ra, rb ){
					state.registers[rr] = state.registers[ra] + state.registers[rb];
				}
			},
			'1': {
				name: 'SUB',
				number_of_registers: 3,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, rr, ra, rb ){
					state.registers[rr] = state.registers[ra] - state.registers[rb];
				}
			},
			'2': {
				name: 'INCR',
				number_of_registers: 1,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, ra ){
					++state.registers[ra];
				}
			},
			'3': {
				name: 'DECR',
				number_of_registers: 1,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, ra ){
					--state.registers[ra];
				}
			},
			'4': {
				name: 'AND',
				number_of_registers: 3,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, rr, ra, rb ){
					state.registers[rr] = state.registers[ra] & state.registers[rb];
				}
			},
			'5': {
				name: 'OR',
				number_of_registers: 3,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, rr, ra, rb ){
					state.registers[rr] = state.registers[ra] | state.registers[rb];
				}
			},
			'6': {
				name: 'NOT',
				number_of_registers: 0,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, ra ){
					state.registers[ra] = ~state.registers[ra]; 
				}
			},
			'7': {
				name: 'XOR',
				number_of_registers: 3,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, rr, ra, rb ){
					state.registers[rr] = state.registers[ra] ^ state.registers[rb];
				}
			},
			'8': {
				name: 'LOAD',
				number_of_registers: 1,
				raw_value: true,
				raw_value_length: 6,
				length: 13,
				run: function( state, ra, value ){
					state.registers[ ra ] = value;
				}
			},
			'9': {
				name: 'RETURN',
				number_of_registers: 1,
				raw_value: false,
				raw_value_length: 0,
				length: 13,
				run: function( state, ra ){
					state.registers[0] = state.registers[ra];
					state.pc = -1;
				}
			},
		},
		program: [],
		memory_size: 7,
		memory_init: [],
		byte_length: 13,
		operator_length: 4,
		register_length: 3,
		register_size: 6,
		num_registers: 8
	}, [
	    'LOAD R1 0x35',
	    'LOAD R2 0b110',
	    'LOAD R4 17',
	    'ADD R3 R1 R2',
	    'INCR R3',
	    'AND R1 R2 R3',
	    'DECR R1',
	    'RETURN R1'
	] );
	
	unit.deepEqual( result, [
  		'1000 001 110101', // LOAD R1 with 0d53
		'1000 010 000110', // LOAD R2 with 0d6
		'1000 100 010001',
		'0000 011 001 010', // ADD R1 and R2 into R3 (d53 + d6 = d59)
		'0010 011 000000', // INCR R3 (d59 + d1 = d60)
		'0100 001 010 011', // AND R2 and R3 into R1 ( b000110 & b111100 = b000100 )
		'0011 001 000000', // DECR R1 (d4 - d1 = d3)
		'1001 001 000000'  // RETURN R1 into R0 (d3)
	], 'Compiler returns correct result' );
	
	unit.done();
};

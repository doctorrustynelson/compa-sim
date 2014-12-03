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

var Systematic = require( '../lib/core' );

module.exports.testCanStep = {
	emptyProgram: function( test ){	
		var core = new Systematic({
			instructions: {},
			program: [],
			mem_size: 0,
			byte_length: 0,
			instruction_length: 0,
			operator_length: 0,
			register_length: 0,
			register_size: 0,
			num_registers: 1
		});
		
		test.ok( !core.canStep() );
		test.done();
	},
	
	simpleProgram: function( test ){
		var core = new Systematic({
			instructions: {},
			program: [],
			mem_size: 1,
			byte_length: 0,
			instruction_length: 0,
			operator_length: 0,
			register_length: 0,
			register_size: 0,
			num_registers: 1
		});
		
		test.ok( core.canStep() );
		test.done();
	}
};

module.exports.integrationTests = {
	basic: function( test ){
		test.equal( require( '../bin/basic-simulation' ), 3 );
		test.done();
	}
};

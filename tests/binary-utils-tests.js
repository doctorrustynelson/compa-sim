
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

require( '../lib/utils/binary-utils' );

module.exports.stringToNumberConversionTest = function( test ){
	test.strictEqual( parseInt( '0011', 2 ), 3 );
	test.strictEqual( '0011'.binaryToNumber() , 3 );
	test.strictEqual( parseInt( '1011', 2 ), 11 );
	test.strictEqual( '1011'.binaryToNumber(), 11 );
	test.strictEqual( parseInt( '0011', 16 ), 17 );
	test.strictEqual( '0011'.hexToNumber() , 17 );
	test.strictEqual( parseInt( '000a', 16 ), 10 );
	test.strictEqual( '000a'.hexToNumber(), 10 );
	test.done();
};

module.exports.numberToStringConversionTest = function( test ){
	test.strictEqual( Number(3).toString( 2 ), '11' );
	test.strictEqual( (3).toBinaryString(), '11' );
	test.strictEqual( Number(11).toString( 2 ), '1011' );
	test.strictEqual( (11).toBinaryString(), '1011' );
	test.strictEqual( Number(3).toString( 16 ), '3' );
	test.strictEqual( (3).toHexString(), '3' );
	test.strictEqual( Number(17).toString( 16 ), '11' );
	test.strictEqual( (17).toHexString(), '11' );
	test.strictEqual( Number(10).toString( 16 ), 'a' );
	test.strictEqual( (10).toHexString(), 'a' );
	test.strictEqual( (3).toBinaryString(4), '0011' );
	test.strictEqual( (11).toBinaryString(4), '1011' );
	test.strictEqual( (3).toHexString(2), '03' );
	test.strictEqual( (17).toHexString(2), '11' );
	test.strictEqual( (10).toHexString(2), '0a' );
	test.done();
};

module.exports.numberTruncationTest = function( test ){
	test.strictEqual( (3).truncate(2), 3 );
	test.strictEqual( (8).truncate(2), 0 );
	test.strictEqual( (17).truncate(4), 1 );
	test.strictEqual( (14).truncate(4), 14 );
	test.done();
};

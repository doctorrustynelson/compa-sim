/**
 * New node file
 */

require( './utils/binary-utils.js' );

module.exports = function( config, program ){
	var result = [];
	
	var instructionCodes = Object.keys( config.instructions );
	
	function getInstructionCode( name ){
		for( var i = 0; i < instructionCodes.length; ++i ){
			if( config.instructions[ instructionCodes[ i ] ].name === name )
				return instructionCodes[ i ];
		}
		throw new Error( 'Failed to find instruction ' + name + '.' );
	}
	
	function getRegisterCode( register ){
		var number = register.replace( 'R', '' ).trim( );
		return number.hexToNumber();
	}
	
	function getValueCode( value ){
		if( value.match( '0x[0-9a-f]*' ) ){
			return value.replace( '0x', '' ).hexToNumber();
		}
		
		if( value.match( '0b[01]*' ) ){
			return value.replace( '0b', '' ).binaryToNumber();
		}
		
		if( value.match( '[0-9]*' ) ){
			return parseInt( value, 10 );
		}
		
		throw new Error( 'Failed to convert value ' + value + '.' );
	}
	
	program.forEach( function( line, index ){
		
		if( line === '' )
			return;
		
		var parts = line.split( /\s+/ );
		
		// Read instruction
		var instruction_code = getInstructionCode( parts[ 0 ] );
		var instruction = config.instructions[ instruction_code ];
		
		var number_of_registers = instruction.number_of_registers;
		var raw_value = instruction.raw_value;
		
		if( parts.length !== ( number_of_registers + ( raw_value ? 2 : 1 ) ) )
			throw new Error( 'Incorrect number of arguments for ' + parts[ 0 ] + ' at line ' + index + '.' );
		
		// Determine registers
		var register_codes = [];
		for( var i = 0; i < number_of_registers; ++i ){
			register_codes.push( getRegisterCode( parts[ i + 1 ] ) );
		}
			
		// Determine values
		var value = 0;
		if( raw_value ){
			value = getValueCode( parts[ parts.length - 1 ] );
		}
		
		// Encode
		var instruction_string = instruction_code.hexToNumber().toBinaryString( config.operator_length );
		var register_strings = register_codes.map( function( register ){
			return register.toBinaryString( config.register_length );
		} );
		var value_string = value.toBinaryString( instruction.raw_value_length );
		if( raw_value )
			register_strings.push( value_string );
		
		var new_line = [].concat( [ instruction_string ], register_strings ).join( ' ' );
		
		var temp_line = new_line.replace( ' ', '' );
		while( temp_line.indexOf( ' ' ) !== -1 )
			temp_line = temp_line.replace( ' ', '' );
		
		var padding = instruction.length - temp_line.length;
		if( padding > 0 )
			new_line = new_line + ' ' + (0).toBinaryString( padding );
		
		result.push( new_line );
	} );
	
	return result;
};
/**
 * New node file
 */

module.exports = {
	instructions: {
		'60': {
			name: 'ADD',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				var result = this.truncate( state.registers[ rd ] + state.registers[ rs ] );
				if( this.isNegative( result ) ){
					state.N = true;
					state.P = false;
					state.Z = false;
					state.DBZ = false;
					if( !this.isNegative( state.registers[ rd ] ) && !this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				} else if( result === 0 ){
					state.N = false;
					state.P = true;
					state.Z = true;
					state.DBZ = false;
					state.O = false;
				} else {
					state.N = false;
					state.P = true;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) && this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				}
					
				state.registers[ rd ] = result;
			}
		},
		'61': {
			name: 'SUB',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				var result = this.truncate( state.registers[ rd ] - state.registers[ rs ] );
				if( this.isNegative( result ) ){
					state.N = true;
					state.P = false;
					state.Z = false;
					state.DBZ = false;
					if( !this.isNegative( state.registers[ rd ] ) && this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				} else if( result === 0 ){
					state.N = false;
					state.P = true;
					state.Z = true;
					state.DBZ = false;
					state.O = false;
				} else {
					state.N = false;
					state.P = true;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) && !this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				}
					
				state.registers[ rd ] = result;
			}
		},
		'62': {
			name: 'MULT',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				var result = this.truncate( state.registers[ rd ] - state.registers[ rs ] );
				if( this.isNegative( result ) ){
					state.N = true;
					state.P = false;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) === this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				} else if( result === 0 ){
					state.N = false;
					state.P = true;
					state.Z = true;
					state.DBZ = false;
					if( state.registers[ rd ] !== 0 && state.registers[ rs ] !== 0 )
						state.O = true;
					else
						state.O = false;
				} else {
					state.N = false;
					state.P = true;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) !== this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				}
					
				state.registers[ rd ] = result;
			}
		},
		'63': {
			name: 'DIV',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				
				if( state.registers[ rs ] === 0 ){
					state.N = false;
					state.P = false;
					state.Z = false;
					state.DBZ = true;
					state.O = false;
					return;
				}
				
				var result = this.truncate( state.registers[ rd ] / state.registers[ rs ] );
				if( this.isNegative( result ) ){
					state.N = true;
					state.P = false;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) === this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				} else if( result === 0 ){
					state.N = false;
					state.P = true;
					state.Z = true;
					state.DBZ = false;
					state.O = false;
				} else {
					state.N = false;
					state.P = true;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) !== this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				}
					
				state.registers[ rd ] = result;
			}
		},
		'6B': {
			name: 'MOD',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				
				if( state.registers[ rs ] === 0 ){
					state.N = false;
					state.P = false;
					state.Z = false;
					state.DBZ = true;
					state.O = false;
					return;
				}
				
				var result = this.truncate( state.registers[ rd ] % state.registers[ rs ] );
				if( this.isNegative( result ) ){
					state.N = true;
					state.P = false;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) === this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				} else if( result === 0 ){
					state.N = false;
					state.P = true;
					state.Z = true;
					state.DBZ = false;
					state.O = false;
				} else {
					state.N = false;
					state.P = true;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) !== this.isNegative( state.registers[ rs ] ) )
						state.O = true;
					else
						state.O = false;
				}
					
				state.registers[ rd ] = result;
			}
		},
		'64': {
			name: 'INCR',
			number_of_registers: 1,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd ){
				var result = this.truncate( state.registers[ rd ] + 1 );
				if( this.isNegative( result ) ){
					state.N = true;
					state.P = false;
					state.Z = false;
					state.DBZ = false;
					if( !this.isNegative( state.registers[ rd ] ) )
						state.O = true;
					else
						state.O = false;
				} else if( result === 0 ){
					state.N = false;
					state.P = true;
					state.Z = true;
					state.DBZ = false;
					state.O = false;
				} else {
					state.N = false;
					state.P = true;
					state.Z = false;
					state.DBZ = false;
					state.O = false;
				}
					
				state.registers[ rd ] = result;
			}
		},
		'65': {
			name: 'DECR',
			number_of_registers: 1,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd ){
				var result = this.truncate( state.registers[ rd ] - 1 );
				if( this.isNegative( result ) ){
					state.N = true;
					state.P = false;
					state.Z = false;
					state.DBZ = false;
					state.O = false;
				} else if( result === 0 ){
					state.N = false;
					state.P = true;
					state.Z = true;
					state.DBZ = false;
					state.O = false;
				} else {
					state.N = false;
					state.P = true;
					state.Z = false;
					state.DBZ = false;
					if( this.isNegative( state.registers[ rd ] ) )
						state.O = true;
					else
						state.O = false;
				}
					
				state.registers[ rd ] = result;
			}
		},
		'40': {
			name: 'AND',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				state.registers[ rd ] = state.registers[ rd ] & state.registers[ rs ];
				
				if( state.registers[ rd ] === 0 ){
					state.Z = true;
				} else {
					state.Z = false;
				}
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'41': {
			name: 'OR',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				state.registers[ rd ] = state.registers[ rd ] | state.registers[ rs ];
				
				if( state.registers[ rd ] === 0 ){
					state.Z = true;
				} else {
					state.Z = false;
				}
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'43': {
			name: 'XOR',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				state.registers[ rd ] = state.registers[ rd ] ^ state.registers[ rs ];
				
				if( state.registers[ rd ] === 0 ){
					state.Z = true;
				} else {
					state.Z = false;
				}
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'44': {
			name: 'NOT',
			number_of_registers: 1,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd ){
				state.registers[ rd ] = ~state.registers[ rd ];
				
				if( state.registers[ rd ] === 0 ){
					state.Z = true;
				} else {
					state.Z = false;
				}
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'F0': {
			name: 'BR',
			number_of_registers: 0,
			raw_value: true,
			raw_value_length: 16,
			length: 32,
			run: function( state, offset ){
				state.pc = this.truncate( state.pc + offset );
				
				state.Z = false;
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'F1': {
			name: 'BRO',
			number_of_registers: 0,
			raw_value: true,
			raw_value_length: 16,
			length: 32,
			run: function( state, offset ){
				
				if( state.O )
					state.pc = this.truncate( state.pc + offset );
				
				state.Z = false;
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'F2': {
			name: 'BRZ',
			number_of_registers: 0,
			raw_value: true,
			raw_value_length: 16,
			length: 32,
			run: function( state, offset ){
				
				if( state.Z )
					state.pc = this.truncate( state.pc + offset );
				
				state.Z = false;
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'F3': {
			name: 'BRDBZ',
			number_of_registers: 0,
			raw_value: true,
			raw_value_length: 16,
			length: 32,
			run: function( state, offset ){
				
				if( state.DBZ )
					state.pc = this.truncate( state.pc + offset );
				
				state.Z = false;
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'F4': {
			name: 'BRP',
			number_of_registers: 0,
			raw_value: true,
			raw_value_length: 16,
			length: 32,
			run: function( state, offset ){
				
				if( state.P )
					state.pc = this.truncate( state.pc + offset );
				
				state.Z = false;
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'F5': {
			name: 'BRN',
			number_of_registers: 0,
			raw_value: true,
			raw_value_length: 16,
			length: 32,
			run: function( state, offset ){
				
				if( state.N )
					state.pc = this.truncate( state.pc + offset );
				
				state.Z = false;
				state.N = false;
				state.P = false;
				state.DBZ = false;
				state.O = false;
			}
		},
		'00': {
			name: 'NOP',
			number_of_registers: 0,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( ){ }
		},
		'80': {
			name: 'LOADL',
			number_of_registers: 1,
			raw_value: true,
			raw_value_length: 16,
			length: 32,
			run: function( state, rd, value ){
				
				state.registers[rd] = value;
				
				if( this.isNegative( value ) ){
					state.Z = false;
					state.N = true;
					state.P = false;
				} else if ( value === 0 ) {
					state.Z = true;
					state.N = false;
					state.P = true;
				} else {
					state.Z = false;
					state.N = false;
					state.P = true;
				}

				state.DBZ = false;
				state.O = false;
			}
		},
		'81': {
			name: 'LOADS',
			number_of_registers: 1,
			raw_value: true,
			raw_value_length: 8,
			length: 32,
			run: function( state, rd, value ){

				state.registers[rd] = value;
				
				if ( value === 0 ) {
					state.Z = true;
				} else {
					state.Z = false;
				}
	
				state.N = false;
				state.P = true;
				state.DBZ = false;
				state.O = false;
			}
		},
		'84': {
			name: 'CPY',
			number_of_registers: 2,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rd, rs ){
				state.registers[rd] = state.registers[rs];
			}
		},
		'85': {
			name: 'TEST',
			number_of_registers: 1,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rs ){
				
				if( this.isNegative( state.registers[rs] ) ) {
					state.Z = false;
					state.N = true;
					state.P = false;
				} else if ( state.registers[rs] === 0 ) {
					state.Z = true;
					state.N = false;
					state.P = true;
				} else {
					state.Z = false;
					state.N = false;
					state.P = true;
				}
	
				state.DBZ = false;
				state.O = false;
			}
		},
		'88': {
			name: 'EXIT',
			number_of_registers: 1,
			raw_value: false,
			raw_value_length: 0,
			length: 16,
			run: function( state, rs ){
				this.exit( state.registers[ rs ] );
			}
		},
		'10': {
			name: 'LEA',
			number_of_registers: 3,
			raw_value: false,
			raw_value_length: 0,
			length: 32,
			run: function( state, rd, rr, ro ){
				state.registers[ rd ] = state.memory[ this.truncate( state.registers[ rr ] + state.registers[ ro ] ) ];
				
				if( this.isNegative( state.registers[rd] ) ) {
					state.Z = false;
					state.N = true;
					state.P = false;
				} else if ( state.registers[rd] === 0 ) {
					state.Z = true;
					state.N = false;
					state.P = true;
				} else {
					state.Z = false;
					state.N = false;
					state.P = true;
				}
	
				state.DBZ = false;
				state.O = false;
			}
		},
		'11': {
			name: 'SEA',
			number_of_registers: 3,
			raw_value: false,
			raw_value_length: 0,
			length: 32,
			run: function( state, rs, rr, ro ){
				state.memory[ state.registers[ rr ] + state.registers[ ro ] ] = state.registers[ rs ];
			}
		},
	},
	program: [],
	flags: [ 'N', 'P', 'Z', 'DBZ', 'O' ],
	memory_size: 65536,
	memory_init: {},
	byte_length: 16,
	operator_length: 8,
	register_length: 4,
	num_registers: 8
};

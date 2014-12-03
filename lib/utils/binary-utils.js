/**
 * New node file
 */

String.prototype.binaryToNumber = function(){
	return parseInt( this, 2 );
};

String.prototype.hexToNumber = function(){
	return Number(parseInt( this, 16 ));
};

Number.prototype.toBinaryString = function( length ){
	var s = Number(this).toString( 2 );
	while( length && s.length < length ){
		s = '0' + s;
	}
	return s;
};

Number.prototype.toHexString = function( length ){
	var s = Number(this).toString( 16 );
	while( length && s.length < length ){
		s = '0' + s;
	}
	return s;
};

Number.prototype.truncate = function( length ){
	return this & ( ~( (-1) << length ) ); 
};
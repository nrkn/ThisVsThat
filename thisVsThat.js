$(function() {
  var rankings;
  var items;
  var shuffledCombinations;
  var progressMax;
  var debug = false;
  
  $( '#start' ).click(function(){    
    reset();    
    return false;
  });
  
  $( 'textarea' ).removeAttr( 'disabled' );
  
  var reset = function() {  
    $( '#help' ).hide();
    $( '#ranking' ).show();
   
    var lines = clean( $( 'textarea' ).val().split( "\n" ), "" );
    $( '#ranking ol' ).html( '' );
    
    if( lines.length == 1 ) {
      $( '#ranking ol' ).html( '<li><span>' + lines[ 0 ] + '</span></li>' );
      $( '#start' ).text( 'Restart' );
      return;
    } else if ( lines.length <= 0 ) {
      alert( 'Please add some things!' );
      return;
    }
    
    $( '#progress' ).show();    
    $( 'h3' ).show();    
    
    $( 'textarea' ).attr( 'disabled', 'disabled' );
    
    rankings = {};
    items = lines;
    
    for( var i in items ) {
      rankings[ items[ i ] ] = 0;
    }
    
    shuffledCombinations = getCombinations();
    progressMax = shuffledCombinations.length;
    
    doVs();  
  }
  
  var fisherYates = function( things ) {
    var i = things.length;
    if ( i == 0 ) return false;
    while ( --i ) {
      var j = Math.floor( Math.random() * ( i + 1 ) );
      var tempi = things[ i ];
      var tempj = things[ j ];
      things[ i ] = tempj;
      things[ j ] = tempi;
    }
  }
  
  var keysByValue = function( things ){
    var sorted = [];
    
    for( var key in things ){
      if( things.hasOwnProperty( key ) && things[ key ] > 0 ) 
        sorted.push( [ key, things[ key ] ] );
    }
    
    sorted.sort( function( a, b ){
      var a1= a[ 1 ], b1= b[ 1 ];
      return a1 - b1;
    });
    
    for( var i = 0, l = sorted.length; i < l; i++){
      sorted[ i ]= sorted[ i ][ 0 ];
    }
    
    return sorted.reverse();
  }  
  
  var getCombinations = function() {
    var combinations = [];
    for( var i = 0; i < items.length - 1; i++ ) {
      for( var x = i + 1; x < items.length; x++ ) {
        combinations.push( 
          Math.floor( Math.random() * 2 ) == 1 ? {
            first: i,
            second: x
          } : {
            first: x,
            second: i
          }
        );
      }
    }
    fisherYates( combinations )
    return combinations;
  }
  
  var updateRankings = function() {
    var sorted = keysByValue( rankings );
    
    var lis = '';
    for( var i in sorted ) {
      lis += '<li><span>' + sorted[ i ] + '</span></li>';
    }
    
    if( debug ) {
      var debugText = '';
      for( var key in rankings ) {
        debugText += key + ': ' + rankings[ key ] + '<br />';
      }
      $( '#debug' ).html( debugText );
    }
    
    $( '#ranking ol' ).html( lis );
  }
  
  var doVs = function(){
    if( items.length < 2 ) return;
    
    var progress = ( 100 / progressMax ) * ( progressMax - shuffledCombinations.length );
    
    $( '#progress div' ).css({
      width: progress + '%'
    }).html( '<span>' + parseInt( progress ) + '%</span>' );
    
    if( shuffledCombinations.length < 1 ) {
      $( '#choice' ).html(
        '<a href="#" id="start">Restart</a>'
      );
      
      $( '#start' ).click(function(){
        reset();    
        return false;
      });
      
      $( 'textarea' ).removeAttr( 'disabled' );
  
      return;
    } 
    
    var pair = shuffledCombinations.pop();
    var first = pair.first;
    var second = pair.second;
    
    $( '#choice' ).html(
      '<a href="#" id="first">' + items[ first ] + '</a> vs. <a href="#" id="second">' + items[ second ] + '</a><a href="#" id="skip">I can&apos;t decide!</a>'
    ); 
    
    $( '#first, #second' ).click(function(){    
      var other = $( '#' + ( $( this ).attr( 'id' ) == 'first' ? 'second' : 'first' ) ); 
      
      var step = 1 / items.length;
      rankings[ other.text() ] += step;
      rankings[ $( this ).text() ] += 0.5 + ( rankings[ other.text() ] * step );
           
      updateRankings();
      doVs();
      
      return false;
    });
    
    $( '#skip' ).click(function(){
      doVs();
      
      return false;
    });
  }
  
  var clean = function( things, deleteValue ){
    for( var i = 0; i < things.length; i++ ){
      if( things[ i ] == deleteValue ){         
        things.splice( i, 1 );
        i--;
      }
    }
    return things;
  };  
})
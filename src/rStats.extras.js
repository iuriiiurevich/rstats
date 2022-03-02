// https://www.khronos.org/registry/webgl/specs/latest/2.0/#3.7.9
// https://www.khronos.org/registry/OpenGL-Refpages/es3.0/html/glDrawElements.xhtml

window.glStats = function (WebGL2 = true) {

    var _rS = null;

    var _totalDrawArraysCalls = 0,
        _totalDrawElementsCalls = 0,
        _totalUseProgramCalls = 0,
        _totalFaces = 0,
        _totalVertices = 0,
        _totalPoints = 0,
        _totalBindTexures = 0;

    function _h ( f, c ) {
        return function () {
            c.apply( this, arguments );
            f.apply( this, arguments );
        };
    }

    var context, drawArrays, drawElements, useProgram, bindTexture;

    if (WebGL2) {
        context = WebGL2RenderingContext;
        drawArrays = 'drawArrays';
        drawElements = 'drawElements';
        useProgram = 'useProgram';
        bindTexture = 'bindTexture';
    } else {
        context = WebGLRenderingContext;
        drawArrays = 'drawArrays';
        drawElements = 'drawElements';
        useProgram = 'useProgram';
        bindTexture = 'bindTexture';
    }

    context.prototype[drawArrays] = _h( context.prototype[drawArrays], function () {
        _totalDrawArraysCalls++;
        if ( arguments[ 0 ] == this.POINTS ) _totalPoints += arguments[ 2 ];
        else _totalVertices += arguments[ 2 ];
    } );

    context.prototype[drawElements] = _h( context.prototype[drawElements], function () {
        _totalDrawElementsCalls++;
        _totalFaces += arguments[ 1 ] / 3;
        _totalVertices += arguments[ 1 ];
    } );

    context.prototype[useProgram] = _h( context.prototype[useProgram], function () {
        _totalUseProgramCalls++;
    } );

    context.prototype[bindTexture] = _h( context.prototype[bindTexture], function () {
        _totalBindTexures++;
    } );

    var _values = {
        allcalls: {
            over: 3000,
            caption: 'Calls'
        },
        drawelements: {
            caption: 'Calls: drawElements'
        },
        drawarrays: {
            caption: 'Calls: drawArrays'
        }
    };

    var _groups = [ {
        caption: 'WebGL',
        values: [ 'allcalls', 'drawelements', 'drawarrays', 'useprogram', 'bindtexture', 'glfaces', 'glvertices', 'glpoints' ]
    } ];

    // var _fractions = [ {
    //     base: 'allcalls',
    //     steps: [ 'drawelements', 'drawarrays' ]
    // } ];
    var _fractions = [];

    function _update () {
        _rS( 'allcalls' ).set( _totalDrawArraysCalls + _totalDrawElementsCalls );
        _rS( 'drawElements' ).set( _totalDrawElementsCalls );
        _rS( 'drawArrays' ).set( _totalDrawArraysCalls );
        _rS( 'bindTexture' ).set( _totalBindTexures );
        _rS( 'useProgram' ).set( _totalUseProgramCalls );
        _rS( 'glfaces' ).set( _totalFaces );
        _rS( 'glvertices' ).set( _totalVertices );
        _rS( 'glpoints' ).set( _totalPoints );
    }

    function _start () {
        _totalDrawArraysCalls = 0;
        _totalDrawElementsCalls = 0;
        _totalUseProgramCalls = 0;
        _totalFaces = 0;
        _totalVertices = 0;
        _totalPoints = 0;
        _totalBindTexures = 0;
    }

    function _end () {}

    function _attach ( r ) {
        _rS = r;
    }

    return {
        update: _update,
        start: _start,
        end: _end,
        attach: _attach,
        values: _values,
        groups: _groups,
        fractions: _fractions
    };

};

window.threeStats = function ( renderer ) {

    var _rS = null;

    var _values = {
        'renderer.info.memory.geometries': {
            caption: 'Geometries'
        },
        'renderer.info.memory.textures': {
            caption: 'Textures'
        },
        'renderer.info.programs': {
            caption: 'Programs'
        },
        'renderer.info.render.calls': {
            caption: 'Calls'
        },
        'renderer.info.render.triangles': {
            caption: 'Triangles',
            over: 10000
        },
        'renderer.info.render.points': {
            caption: 'Points'
        },
        'renderer.info.render.lines': {
            caption: 'Lines'
        }
    };

    var _groups = [ {
        caption: 'Three.js - Memory',
        values: [ 'renderer.info.memory.geometries', 'renderer.info.programs', 'renderer.info.memory.textures' ]
    }, {
        caption: 'Three.js - Render',
        values: [ 'renderer.info.render.calls', 'renderer.info.render.triangles', 'renderer.info.render.points', 'renderer.info.render.lines' ]
    } ];

    var _fractions = [];

    function _update () {

        _rS( 'renderer.info.memory.geometries' ).set( renderer.info.memory.geometries );
        _rS( 'renderer.info.programs' ).set( renderer.info.programs.length );
        _rS( 'renderer.info.memory.textures' ).set( renderer.info.memory.textures );
        _rS( 'renderer.info.render.calls' ).set( renderer.info.render.calls );
        _rS( 'renderer.info.render.triangles' ).set( renderer.info.render.triangles );
        _rS( 'renderer.info.render.points' ).set( renderer.info.render.points );
        _rS( 'renderer.info.render.lines' ).set( renderer.info.render.lines );

    }

    function _start () {}

    function _end () {}

    function _attach ( r ) {
        _rS = r;
    }

    return {
        update: _update,
        start: _start,
        end: _end,
        attach: _attach,
        values: _values,
        groups: _groups,
        fractions: _fractions
    };

};

/*
 *   From https://github.com/paulirish/memory-stats.js
 */

window.BrowserStats = function () {

    var _rS = null;

    var _usedJSHeapSize = 0,
        _totalJSHeapSize = 0;

    var memory = {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0
    };

    if ( window.performance && performance.memory )
        memory = performance.memory;

    if ( memory.totalJSHeapSize === 0 ) {
        console.warn( 'totalJSHeapSize === 0... performance.memory is only available in Chrome .' );
    }

    var _values = {
        memory: {
            caption: 'Used Memory',
            average: true,
            avgMs: 1000,
            over: 100
        },
        // total: {
        //     caption: 'Total Memory'
        // }
    };

    var _groups = [ {
        caption: 'Browser',
        // values: [ 'memory', 'total' ]
        values: [ 'memory' ]
    } ];

    // var _fractions = [ {
    //     base: 'total',
    //     steps: [ 'memory' ]
    // } ];
    var _fractions = [];

    var log1024 = Math.log( 1024 );

    function _size ( v ) {

        var precision = 100; //Math.pow(10, 2);
        var i = Math.floor( Math.log( v ) / log1024 );
        if( v === 0 ) i = 1;
        return Math.round( v * precision / Math.pow( 1024, i ) ) / precision; // + ' ' + sizes[i];

    }

    function _update () {
        _usedJSHeapSize = _size( memory.usedJSHeapSize );
        _totalJSHeapSize = _size( memory.totalJSHeapSize );

        _rS( 'memory' ).set( _usedJSHeapSize );
        // _rS( 'total' ).set( _totalJSHeapSize );
    }

    function _start () {
        _usedJSHeapSize = 0;
    }

    function _end () {}

    function _attach ( r ) {
        _rS = r;
    }

    return {
        update: _update,
        start: _start,
        end: _end,
        attach: _attach,
        values: _values,
        groups: _groups,
        fractions: _fractions
    };

};

if (typeof module === 'object') {
  module.exports = {
    glStats: window.glStats,
    threeStats: window.threeStats,
    BrowserStats: window.BrowserStats
  };
}

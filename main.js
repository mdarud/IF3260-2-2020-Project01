"use strict";

var canvas;
var gl;

var maxNumVertices  = 200;
var index = 0;

var vertexArray = [];

const notSelected = -1;

var cindex = 0;

var triangleData = [
    vec2(0.1, 0.1),
    vec2(1.0, 0.0),
    vec2(0.0, 1.0)
]

var triangleData2 = [
    vec2(0.2, 0.2),
    vec2(0.9, 0.0),
    vec2(0.0, 1.0)
]

var polygonData = [
    vec2(0.1, 0.1),
    vec2(1.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 1.0)
]

const renderer = new Renderer();

var colors = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
];

var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function() {
        if (cindex == m.selectedIndex) {
            var elementOption = m.options;
            elementOption[cindex].selected = false;
            cindex = notSelected;
        } else {
            cindex = m.selectedIndex;
            // console.log(cindex);
        }
    });

    var a = document.getElementById("Button1")
    a.addEventListener("click", function(){
        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = index;

        console.log(cindex);
        console.log(vertexArray);
        console.log(vec4(colors[cindex]));

        glObject.setVertexArray(vertexArray);
        glObject.setColorArray(vec4(colors[cindex]));
        glObject.bind();
        glObject.draw();
        vertexArray = [];
        // render();
    });

    canvas.addEventListener("mousedown", function(event){
        t = vec2(2*(event.clientX-8)/canvas.width-1,
            2*(canvas.height-event.clientY+8)/canvas.height-1);

        
        // gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        // gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));
        // console.log(flatten(t));

        vertexArray.push(t);
        // console.log(vertexArray);

        /*
        t = vec4(colors[cindex]);

        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

        numIndices[numPolygons]++;
        index++;
        */
    } );


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var colouring = new Array();
    colouring.push(colors[cindex]);
    colouring.push(colors[cindex]);
    colouring.push(colors[cindex]);
    colouring.push(colors[cindex]);

    var glObject = new GLObject("POLYGON", program, gl);
    glObject.setVertexArray(polygonData);
    glObject.setColorArray(colouring);
    glObject.bind();
    renderer.addObject(glObject);

    var colouring = new Array();
    colouring.push(colors[cindex+1]);
    colouring.push(colors[cindex+1]);
    colouring.push(colors[cindex+1]);

    var glObject = new GLObject("POLYGON", program, gl);
    glObject.setVertexArray(triangleData2);
    glObject.setColorArray(colouring);
    glObject.bind();
    renderer.addObject(glObject);

    renderer.render();

    console.log("hoho");
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i=0; i<numPolygons; i++) {
        gl.drawArrays( gl.TRIANGLE_FAN, start[i], numIndices[i] );
    }
}

let gl, program;
let canvas;
let cBuffer, pBuffer;
let vColor, vPosition;
let canvasWidth, canvasHeight;
let initialExtents = [0, 640, 0, 480];

let cIndex = 0;
let colorCycle = [vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];
let setColor = vec4(0.0, 0.0, 0.0, 1.0);

let drawingHistory = []; // used to keep track of the drawing we have so far
let drawingPoints = []; // used when drawing a new set of points
let pointHistory = [];
let colorHistory = [];

let drawMode = true;
let statusdraw = "Nothing"; 
let newLine = false;


function main() {

  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = WebGLUtils.setupWebGL(canvas, undefined);
  if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
  }

  // Initialize shaders
  program = initShaders(gl, "vshader", "fshader");
  gl.useProgram(program);

  // Set up the canvas
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  // Buffer for our points
  pBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);

  // For our vertex positions
  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Buffer for our colors
  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

  // For our vertex colors
  vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  canvas.onclick = function (e) {
      if (drawMode === true) {
          // Get the mouse coordinates of the user
          
          let pos = getMouseCoordinates(e.clientX, e.clientY);
          
          console.log("Drawing")

          var m = document.getElementById("mymenu");

          m.addEventListener("click", function() {
            cIndex = m.selectedIndex;
          });

          setColor = colorCycle[cIndex];

          if (statusdraw === "Line") {
            console.log("Drawing Lines");
            if (drawingPoints.length === 1){
                newLine = true;
            }
            // Push these points to the drawing history
            drawingPoints.push(vec4(parseFloat(pos.x), parseFloat(pos.y), 0.0, 1.0));
            drawingHistory.push(drawingPoints);     
            colorHistory.push(setColor);  
          }

          if (statusdraw === "Poligon") {
            console.log("Drawing Poligon");
            if (drawingPoints.length < 3){}
            else {
                if (drawingPoints[drawingPoints.length - 1] === drawingPoints[0]){
                    newLine = true;
                }
            }
            // Push these points to the drawing history
            drawingPoints.push(vec4(parseFloat(pos.x), parseFloat(pos.y), 0.0, 1.0));
            drawingHistory.push(drawingPoints);
            colorHistory.push(setColor);        
          }

          if (statusdraw === "Square") {
            console.log("Drawing Square");
            pointHistory.push(pos);
            if (pointHistory.length === 2){
                newLine = true;
                length = pointHistory[1].x - pointHistory[0].x ; 
                drawingPoints.push(vec4(parseFloat(pointHistory[0].x), parseFloat(pointHistory[0].y), 0.0, 1.0));
                drawingPoints.push(vec4(parseFloat(pointHistory[0].x + length), parseFloat(pointHistory[0].y ), 0.0, 1.0));
                if (pointHistory[1].y > pointHistory[0].y ){
                    if (length > 0 ) {
                        drawingPoints.push(vec4(parseFloat(pointHistory[0].x + length), parseFloat(pointHistory[0].y + length), 0.0, 1.0));//
                        drawingPoints.push(vec4(parseFloat(pointHistory[0].x ), parseFloat(pointHistory[0].y + length), 0.0, 1.0));//
                    } else {
                        drawingPoints.push(vec4(parseFloat(pointHistory[0].x + length), parseFloat(pointHistory[0].y - length), 0.0, 1.0));
                        drawingPoints.push(vec4(parseFloat(pointHistory[0].x ), parseFloat(pointHistory[0].y - length), 0.0, 1.0));
                    }
                } else {
                    if (length > 0 ){
                    drawingPoints.push(vec4(parseFloat(pointHistory[0].x + length), parseFloat(pointHistory[0].y - length), 0.0, 1.0));
                    drawingPoints.push(vec4(parseFloat(pointHistory[0].x ), parseFloat(pointHistory[0].y - length), 0.0, 1.0));
                    }
                    else {
                    drawingPoints.push(vec4(parseFloat(pointHistory[0].x + length), parseFloat(pointHistory[0].y +   length), 0.0, 1.0));
                    drawingPoints.push(vec4(parseFloat(pointHistory[0].x ), parseFloat(pointHistory[0].y + length), 0.0, 1.0));        
                    }
                }

                drawingPoints.push(vec4(parseFloat(pointHistory[0].x), parseFloat(pointHistory[0].y), 0.0, 1.0));
                drawingHistory.push(drawingPoints);
                colorHistory.push(setColor);
                pointHistory = [];
            }
            // p1 = {x1,y1} p3 = {x2,y2} p2 = {x1,y2} p4 = {x2,y2}
                    
          }


          if (newLine) {
              console.log("done");
              console.log(drawingHistory);
              drawingPoints = [];
              newLine = false;
          }
          for (let d in drawingHistory) {
              drawLine(drawingHistory[d],colorHistory[d]);
          }
      }
  };
}
function drawSquare(){
    document.getElementById("mode").innerHTML = "Draw Mode : Square";
    document.getElementById("modeDescription").innerHTML = "You are currently in drawing square mode. If you want to restart, click Draw! again";
    drawingPoints = [];
    if (statusdraw === "Square"){}
    else statusdraw = "Square"
}
function drawLines(){
    document.getElementById("mode").innerHTML = "Draw Mode : Lines";
    document.getElementById("modeDescription").innerHTML = "You are currently in drawing lines mode. If you want to restart, click Draw! again";
    drawingPoints = [];
    if (statusdraw === "Line"){}
    else statusdraw = "Line"
}
function drawPoligon(){
    document.getElementById("mode").innerHTML = "Draw Mode : Poligon";
    document.getElementById("modeDescription").innerHTML = "You are currently in drawing lines mode. If you want to restart, click Draw! again";
    drawingPoints = [];
    if (statusdraw === "Poligon"){}
    else statusdraw = "Poligon"
}

function drawConditional(){
    document.getElementById("mode").innerHTML = "Draw Mode";
    document.getElementById("modeDescription").innerHTML = "You are currently in draw mode. Click Other Button to start drawing, if you want to restart, click Draw! again";
    resetCanvas();
    drawMode = true;
}



/**
* Get the coordinates of the mouse and transform them into suitable coordinates for WebGL
* @param clientX
* @param clientY
* @returns {{x: number, y: number}}
*/
function getMouseCoordinates(clientX, clientY) {
  // Get the canvas rectangle
  let rect = canvas.getBoundingClientRect();

  // Given the viewport, find where the mouse is
  let x = ((clientX - rect.left) / canvas.width);
  let y = ((canvas.height - (clientY - rect.top)) / canvas.height);

  // Given our extents, get the actual coordinates for the point
  x = (x * (initialExtents[1] - initialExtents[0]) + initialExtents[0]);
  y = (y * (initialExtents[3] - initialExtents[2]) + initialExtents[2]);

  return {
      x: x,
      y: y,
  }
}

/**
* Adjust the size of the canvas and viewport to preserve the aspect ratio
* of a drawing
* @param extentsWidth
* @param extentsHeight
*/
function adjustCanvasViewport(extentsWidth, extentsHeight) {
  let extentsRatio = extentsWidth / extentsHeight;

  if (extentsRatio > canvasWidth / canvasHeight) {
      gl.viewport(0, 0, canvasWidth, canvasWidth / extentsRatio);
      canvas.height = canvasWidth / extentsRatio;
      canvas.width = canvasWidth;
  } else if (extentsRatio < canvasWidth / canvasHeight) {
      gl.viewport(0, 0, canvasHeight * extentsRatio, canvasHeight);
      canvas.height = canvasHeight;
      canvas.width = canvasHeight * extentsRatio;
  }
}

/**
* Given an array of points, draw them to our global variable "gl"
* @param points
* @param color
*/
function drawLine(points,color) {
  gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  // for all of our points, push a color
  let colors = [];
  for (let p in points) {
      colors.push(color);
  }

  // let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  // Draw a dot on the first click
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.drawArrays(gl.LINE_STRIP, 0, points.length);
}

/**
* Reset our canvas - useful to call if you want to start a new drawing or switch modes
*/
function resetCanvas() {
  drawingHistory = [];
  drawingPoints = [];

  // Set viewport
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set clear color
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Clear <canvas> by clearing the color buffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Handle extents
  let proj = ortho(0.0, 640.0, 0.0, 480.0, -1.0, 1.0);
  let projMatrix = gl.getUniformLocation(program, "projMatrix");
  gl.uniformMatrix4fv(projMatrix, false, flatten(proj));

  // Resize canvas and viewport
  adjustCanvasViewport(640, 480);
}

 
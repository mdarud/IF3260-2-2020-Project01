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
let shapes = [];
let colorHistory = [];
let mousePos = {
  x: 0,
  y: 0
}

let drawMode = true;
let isMove = false;
let statusdraw = "Nothing"; 
let newLine = false;


function main() {

  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
  }

  // Initialize shaders
  var vertSrc = `precision mediump float;
    
    attribute vec2 vertPos;
    uniform vec2 screenRes;
    uniform mat3 transToOrigin;
    uniform mat3 scaleMat;
    uniform mat3 transBack;

    void main() {
        vec3 transResult = transBack * scaleMat * transToOrigin * vec3(vertPos, 1.0);
        vec2 newPos = 2.0*transResult.xy/screenRes;
        gl_Position = vec4(newPos, 0.0, 1.0);
    }`;

  var fragSrc = `precision mediump float;

  uniform vec4 u_fragColor;
  void main() {
      gl_FragColor = u_fragColor;
  }`;

  var vertShader = gl.createShader(gl.VERTEX_SHADER);
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertShader, vertSrc);
  gl.shaderSource(fragShader, fragSrc);

  gl.compileShader(vertShader);
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      console.log("failed to compile vertex shader, ", gl.getShaderInfoLog(vertShader));
      return;
  }

  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      console.log("failed to compile fragment shader, ", gl.getShaderInfoLog(fragShader));
      return;
  }

  program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("failed to link program : ", gl.getProgramInfoLog(program));
      return;
  }
  
  // Set up the canvas
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  // Set canvas event listener
  canvas.addEventListener('mousemove', canvasOnMouseMove);
  canvas.addEventListener('mousedown', canvasOnMouseDown);
  canvas.addEventListener('mouseup', canvasOnMouseUp);

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
            shapes.push(
              {
                  type: 'line',
                  vertices: [
                      pos.x, pos.y,
                      pos.x + gl.canvas.width/8, pos.y
                  ],
                  scaleMat: [
                      1.0, 0, 0,
                      0, 1.0, 0,
                      0, 0, 1.0
                  ],
                  transToOrigin: [
                      1.0, 0, 0,
                      0, 1.0, 0,
                      0, 0, 1.0
                  ],
                  transBack: [
                      1.0, 0, 0,
                      0, 1.0, 0,
                      0, 0, 1.0
                  ],
                  mode: gl.LINES,
                  color: setColor,
                  type: 'line',
                  id: 0,
              }
            );
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
            shapes.push(
              {
                type: 'square',
                midPoint: [pos.x + gl.canvas.width/16, pos.y - gl.canvas.height/16],
                vertices: [
                    pos.x, pos.y,
                    pos.x + gl.canvas.width/8, pos.y,
                    pos.x + gl.canvas.width/8, pos.y - gl.canvas.width/8,
                    pos.x, pos.y,
                    pos.x + gl.canvas.width/8, pos.y - gl.canvas.width/8,
                    pos.x, pos.y - gl.canvas.width/8
                ],
                scaleMat: [
                    1.0, 0, 0,
                    0, 1.0, 0,
                    0, 0, 1.0
                ],
                transToOrigin: [
                    1.0, 0, 0,
                    0, 1.0, 0,
                    0, 0, 1.0
                ],
                transBack: [
                    1.0, 0, 0,
                    0, 1.0, 0,
                    0, 0, 1.0
                ],
                mode: gl.TRIANGLES,
                color: setColor,
                id: 1
              });
          }
          // p1 = {x1,y1} p3 = {x2,y2} p2 = {x1,y2} p4 = {x2,y2}                
      }
  };
  requestAnimationFrame(render);
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

function canvasOnMouseMove(event) {
  let rect = canvas.getBoundingClientRect();
  let xMax = gl.canvas.width / 2;
  let yMax = gl.canvas.height / 2;

  mousePos.x = event.clientX - rect.x - xMax;
  mousePos.y = rect.y - event.clientY + yMax;
}

function canvasOnMouseUp(event) {
  move = false;
}

function canvasOnMouseDown(event) {
  activeObject = null;
  isMove = false;
  chosenIdx = -1;
  document.getElementById("scale-box").style.display = 'none';
  for (shape of shapes) {
      oldVertices = [];
      oldMidPoint = [];
      for (let i = 0; i < shape.vertices.length; i += 2) {
          let mat = matrixMultiplication(
              matrixTranspose(shape.transBack), 
              matrixMultiplication(matrixTranspose(shape.scaleMat), matrixTranspose(shape.transToOrigin))
          );
          let transformedVertice = transform(mat, [shape.vertices[i], shape.vertices[i + 1], 1.0])
          oldVertices.push(shape.vertices[i]);
          oldVertices.push(shape.vertices[i + 1]);
          if (Math.abs(transformedVertice[0] - mousePos.x) < 5 && Math.abs(transformedVertice[1] - mousePos.y) < 5) {
              isMove = true;
              activeObject = shape;
              startX = mousePos.x;
              startY = mousePos.y;
              chosenIdx = i;
              if (shape.type === 'square') {
                  oldMidPoint.push(shape.midPoint[0]);
                  oldMidPoint.push(shape.midPoint[1]);
              }
          }
      }
      if (isMove)
          break;
  }

  if (isMove) {
      if (activeObject.type === 'square') {
          document.getElementById("scale-box").style.display = 'inline';
      }
  }
}

function moveObject() {
  if (isMove) {
    let xTrans = mousePos.x - startX;
    let yTrans = mousePos.y - startY;
    if (activeObject.type === 'line') {
        activeObject.vertices[chosenIdx] = oldVertices[chosenIdx] + xTrans;
        activeObject.vertices[chosenIdx + 1] = oldVertices[chosenIdx + 1] + yTrans;
    } else {
        for (let i = 0; i < activeObject.vertices.length; i += 2) {
            activeObject.vertices[i] = oldVertices[i] + xTrans;
            activeObject.vertices[i + 1] = oldVertices[i + 1] + yTrans;
        }

        if (activeObject.type === 'square') {
            activeObject.midPoint[0] = oldMidPoint[0] + xTrans;
            activeObject.midPoint[1] = oldMidPoint[1] + yTrans;
            let translateToOrigin = [
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                -activeObject.midPoint[0], -activeObject.midPoint[1], 1.0
            ];
            let translateBack = [
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                activeObject.midPoint[0], activeObject.midPoint[1], 1.0
            ];
            activeObject.transToOrigin = translateToOrigin;
            activeObject.transBack = translateBack;
        }
    }
  }
}

function drawObject(shape, program) {
  let buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.vertices), gl.STATIC_DRAW);

  gl.useProgram(program);
  let pos = gl.getAttribLocation(program, 'vertPos');
  gl.vertexAttribPointer(
      pos,
      2,
      gl.FLOAT,
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT,
      0
  );
  
  var uniformCol = gl.getUniformLocation(program, 'u_fragColor')
  gl.uniform4fv(uniformCol, shape.color);
  gl.enableVertexAttribArray(pos);

  let matLocation = gl.getUniformLocation(program, 'transToOrigin');
  gl.uniformMatrix3fv(matLocation, false, new Float32Array(shape.transToOrigin));
  matLocation = gl.getUniformLocation(program, 'scaleMat');
  gl.uniformMatrix3fv(matLocation, false, new Float32Array(shape.scaleMat));
  matLocation = gl.getUniformLocation(program, 'transBack');
  gl.uniformMatrix3fv(matLocation, false, new Float32Array(shape.transBack));

  gl.drawArrays(shape.mode, 0, shape.vertices.length/2);
}

function matrixTranspose(mat) {
  let copyMat = [];
  for (elmt of mat) {
      copyMat.push(elmt);
  }

  for (let i = 0; i < 3; i++) {
      for (let j = i; j < 3; j++) {
          let temp = copyMat[3*i + j];
          copyMat[3*i + j] = copyMat[3*j + i];
          copyMat[3*j + i] = temp;
      }
  }

  return copyMat;
}

function matrixMultiplication(matA, matB) {

  if (matA.length != matB.length) {
      return;
  }

  let outputMat = [];
  let matLength = 3;
  for (let i = 0; i < matLength; i++) {
      for (let j = 0; j < matLength; j++) {
          let sum = 0;
          for (let k = 0; k < matLength; k++) {
              sum += matA[i*matLength + k] * matB[k*matLength + j];
          }
          outputMat.push(sum);
      }
  }

  return outputMat;
}

function transform(mat, vertice) {
  let tempVertice = [];
  let n = vertice.length;
  for (let i = 0; i < n; i++) {
      let sum = 0.0;
      for (let j = 0; j < n; j++) {
          sum += (mat[i*n + j] * vertice[j]);
      }
      tempVertice.push(sum);
  }

  return tempVertice;
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

function render() {
  moveObject();
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  for (shape of shapes) {
      drawObject(shape, program);
  }
  requestAnimationFrame(render);
};

 
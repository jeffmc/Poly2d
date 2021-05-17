import Input from "./input.js";
import Util from "./util.js";
import SelectTool from "./select.js";
import LineTool from "./line.js";
import {Event, EventDispatcher, EventHandler} from "./event.js";
import {Layer, LayerStack} from "./layer.js";

const BIN_HALF_DONT_REF = 20;
const CONFIG = {
  pWidth: 640,
  pHeight: 480,
  bin_half: BIN_HALF_DONT_REF,
  bin_size: BIN_HALF_DONT_REF*2,
  snappingEnabled: true,
  color: {
    bg: [40,40,40],
    cursor: [215,100,215],
    grid: [160,160,160],
  }
}

let canvas, gfx;

let input, util, selectTool, lineTool; // various singletons

let elements; // drawn elements

let frameCount = 0;
let framesSinceLast = 0;
let lastTimestamp = 0;
let lastFrame = 0;
let framesPerSec = 0;


let layerStack;
let testLayer, testOver;

function setup() {
  canvas = document.getElementById("canvas");
  gfx = canvas.getContext("2d");
  onResize();
  
  input = new Input(CONFIG);
  util = new Util(CONFIG, input);
  selectTool = new SelectTool(CONFIG);
  lineTool = new LineTool(CONFIG, util);

  input.setup();

  elements = [];
  window.addEventListener("resize", onResize);

  layerStack = new LayerStack("TestStack");
  testLayer = new Layer("TestLayer");
  testOver = new Layer("TestOverlay");
  layerStack.pushLayer(testLayer);
  layerStack.pushOverlay(testOver);
}

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  CONFIG.pWidth = canvas.width;
  CONFIG.pHeight = canvas.height;
}

function loop() {
  requestAnimationFrame(loop);
  
  let rn = Date.now();
  let delta = rn - lastTimestamp;
  let timestep = rn - lastFrame;
  lastFrame = rn;
  if (delta >= 1000) {
    framesPerSec = Math.round(framesSinceLast / delta * 1000);
    framesSinceLast = 0;
    lastTimestamp = rn;
    console.log(`${framesPerSec} FPS`);

    perSecond();
  }
  framesSinceLast++;
  frameCount++;
  
  perFrame();
}

function perSecond() {
  // console.log(layerStack.toString());
}

function perFrame() {
  gfx.fillStyle = `rgb(${CONFIG.color.bg.join(",")}`;
  gfx.strokeStyle = "transparent";
  gfx.fillRect(0,0, CONFIG.pWidth, CONFIG.pHeight);

  paintGridDots();
  paintCursor();
  // paintPlausibleSegment();
  // paintElements();
}

function paintGridDots() {
  gfx.fillStyle = `rgb(${CONFIG.color.grid.join(",")}`;
  gfx.strokeStyle = "transparent";
  for (let x=CONFIG.bin_half+(CONFIG.pWidth % CONFIG.bin_size) / 2; 
    x < CONFIG.pWidth; 
    x += CONFIG.bin_size ) {
    for ( let y=CONFIG.bin_half+(CONFIG.pHeight % CONFIG.bin_size) / 2;
      y < CONFIG.pHeight;
      y += CONFIG.bin_size ) {
  gfx.fillRect(x-0.5,y-0.5, 1, 1); // centered rectangle TODO: ADD CONFIG FOR DIAMETER OF GRID DOTS
    }
  }
}

function paintCursor() {
  let z = util.getCursorCoords();
  gfx.fillStyle = "red";
  gfx.strokeStyle = `rgb(${CONFIG.color.cursor.join(",")})`;
  gfx.beginPath();
  gfx.ellipse(z[0],z[1],5,5,0,0,Math.PI*2);
  gfx.stroke();
}

/*
function mousePressed() {
  [cx,cy] = getCursorCoords();
  bx = cx;
  by = cy;
  segmenting = true;
}

function mouseReleased() {
  [cx,cy] = getCursorCoords();
  segments.push([bx,by,cx,cy]);
  segmenting = false;
}
*/

function paintPlausibleSegment() {
  if (segmenting) {
    [px,py] = getCursorCoords();
    stroke(CONFIG.color.cursor)
    strokeWeight(1);
    line(bx,by,px,py);
  }
}
function paintElements() {
  stroke(215,215,100)
  strokeWeight(1);
  for (let ls of segments) {
    [sx,sy,fx,fy] = ls;
    line(sx,sy,fx,fy);
  }
}

setup();
loop();
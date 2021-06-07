import {Input} from "./input.js";
import {Util} from "./util.js";
import {SelectTool} from "./select.js";
import {LineTool} from "./line.js";
import {Event, EventDispatcher, EventHandler} from "./event.js";
import {Layer, LayerStack} from "./layer.js";
import {Renderer, Shader} from "./renderer.js";

export class Poly {
  constructor(cfg,canvas) {
    // TODO: remove pWidth and pHeight from config. Make them their own viewportDimension/Size class.
    this.config = {
      pWidth: 640, // p is for pixel
      pHeight: 480,
      bin_half: 5,
      bin_size: 10,
      snappingEnabled: true,
      color: {
        bg: [0.2,0.2,0.2],
        cursor: [0.8,0.4,0.8],
        grid: [0.6,0.6,0.6],
      },
      autoStretchFullscreen: true,
    }
    Object.assign(this.config, cfg); // override defaults with user-given config.

    this.canvas = canvas;
  }
  start(applicationLayer) {
    this.init();
    this.layerStack.pushLayer(applicationLayer);
    this.loop();
  }
  init() {
    this.input = new Input(this.config);
    this.renderer = new Renderer(
      this.config,
      this.canvas,
    );
    this.layerStack = new LayerStack("Poly LayerStack");
    this.util = new Util(this.config, this.input);
    this.selectTool = new SelectTool(this.config);
    this.lineTool = new LineTool(this.config, this.util);

    this.input.init();
    this.renderer.init();

    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();

    this.loopData = {
      rn: Date.now(),
      lastFrame: (Date.now() - 1000),
      delta: 0,
    }
  }
  loop() {
    requestAnimationFrame(this.loop.bind(this));
    this.loopData.rn = Date.now();
    this.loopData.delta = this.loopData.rn - this.loopData.lastFrame;
    this.update(this.loopData.delta);
    this.loopData.lastFrame = this.loopData.rn;
  }

  update(delta) {
    this.renderer.begin();
    // paintGridDots();
    // paintCursor();
    
    this.layerStack.layers.forEach((layer) => {
      layer.onUpdate(delta);
    })

    // paintPlausibleSegment();
    // paintElements();
    this.renderer.end();
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.config.pWidth = this.canvas.width;
    this.config.pHeight = this.canvas.height;

    // this.camera.onResize(); TODO: still want to trigger these calls on cameras when viewport changes
    this.renderer.onResize();
  }
}

// let elements; // TODO: move to own class

/*
ALL FUNCTIONS BELOW AREN'T BUILT FOR WEBGL YET

function paintGridDots() {
  let bin_size = CONFIG.bin_half * 2 
  renderer.fillStyle(`rgb(${CONFIG.color.grid.join(",")}`);
  renderer.strokeStyle("transparent");
  for (let x=CONFIG.bin_half+(CONFIG.pWidth % bin_size) / 2; 
    x < CONFIG.pWidth; 
    x += bin_size ) {
    for ( let y=CONFIG.bin_half+(CONFIG.pHeight % bin_size) / 2;
      y < CONFIG.pHeight;
      y += bin_size ) {
  renderer.rect(x-0.5,y-0.5, 1, 1); // centered rectangle TODO: ADD CONFIG FOR DIAMETER OF GRID DOTS
    }
  }
}

function paintCursor() {
  let z = util.getCursorCoords();
  renderer.fillStyle("red");
  renderer.strokeStyle(`rgb(${CONFIG.color.cursor.join(",")})`);
  renderer.beginPath();
  renderer.ellipse(z[0],z[1],5,5,0,0,Math.PI*2);
  renderer.stroke();
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
*/
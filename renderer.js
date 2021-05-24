export class Renderer {
  constructor(config, htmlCanvas, cam = null) {
    this.config = config;
    this.htmlCanvas = htmlCanvas;
    this.camera = cam;
    this.get2DContext();
  }
  init() {
    console.log("Init renderer!");
    console.log(`Auto-strech fullscreen: ${this.config.autoStretchFullscreen}`);

    // console.log(document.querySelector("#vertShader").text)
  }
  updateTransformFromCamera() {
    this.gfx.setTransform(this.camera.getTransform());
  }
  get2DContext() {
    this.gfx = this.htmlCanvas.getContext("2d", 
    {
      alpha: false,
      desynchronized: false, // IF true, tremendous flickering occurs, likely that a canvas is being drawn before completion. 
    });
    return this.gfx;
  }
  onResize() {

  }
  setCamera(cam) {
    this.camera = cam
  }

  // CanvasRenderingContext2D SPECIFIC FUNCTIONS
  fillStyle(style) {
    this.gfx.fillStyle = style;
  }
  strokeStyle(style) {
    this.gfx.strokeStyle = style;
  }
  rect(x,y,w,h) {
    this.gfx.fillRect(x,y,w,h);
  }
  beginPath() {
    this.gfx.beginPath()
  }
  ellipse(x,y,rx,ry,rot,sa,ea) {
    this.gfx.ellipse(x,y,rx,ry,rot,sa,ea);
  }
  stroke() { // stroke the path using current style
    this.gfx.stroke();
  }
}
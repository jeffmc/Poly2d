let gl = null;

export class Renderer {
  constructor(config, htmlCanvas, cam = null) {
    this.config = config;
    this.htmlCanvas = htmlCanvas;
    this.camera = cam;
    this.gfx = null;
  }
  getWebGLContext() {
    this.gfx = this.htmlCanvas.getContext("webgl2", 
    {
      alpha: false,
      desynchronized: false, // IF true, tremendous flickering occurs, likely that a canvas is being drawn before completion. 
      antialias: false, // TODO: Make this derive from a parameter in constructor 
      depth: true,
      failIfMajorPerformanceCaveat: true,
      powerPreference: "default",
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      stencil: false,
    });
    gl = this.gfx;
    return this.gfx;
  }
  init() {
    this.getWebGLContext();
    let bg = this.config.color.bg;
    gl.clearColor(bg[0],bg[1],bg[2],1);
  }
  updateTransformFromCamera() {
    // this.gfx.setTransform(this.camera.getTransform());
  }
  onResize() {
    this.gfx.viewport(0,0,this.config.pWidth,this.config.pHeight);
  }
  setCamera(cam) {
    this.camera = cam
  }
  begin() { // before all draw calls within a frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
  end() { // after all draw calls within a frame
    gl.flush();
  }
  // CanvasRenderingContext2D SPECIFIC FUNCTIONS
  fillStyle(style) {
    // this.gfx.fillStyle = style;
  }
  strokeStyle(style) {
    // this.gfx.strokeStyle = style;
  }
  rect(x,y,w,h) {
    // this.gfx.fillRect(x,y,w,h);
  }
  beginPath() {
    // this.gfx.beginPath()
  }
  ellipse(x,y,rx,ry,rot,sa,ea) {
    // this.gfx.ellipse(x,y,rx,ry,rot,sa,ea);
  }
  stroke() { // stroke the path using current style
    // this.gfx.stroke();
  }
}

export class Shader {
  constructor(vertSel = undefined, fragSel = undefined) { 
    this.program = gl.createProgram();
    this.attribLocations = {};
    this.vertShader = vertSel ? this.createShader(
      document.querySelector(vertSel).text,
      gl.VERTEX_SHADER) : null;
    this.fragShader = fragSel ? this.createShader(
      document.querySelector(fragSel).text, 
      gl.FRAGMENT_SHADER) : null;
    this.attachAndLink();
  }
  createShader(sourceCode, type) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var shader = gl.createShader( type );
    gl.shaderSource( shader, sourceCode );
    gl.compileShader( shader );
    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
      var info = gl.getShaderInfoLog( shader );
      throw 'Could not compile WebGL program. \n\n' + info;
    }
    return shader;
  }
  attachAndLink() {
    gl.attachShader(this.program, this.vertShader);
    gl.attachShader(this.program, this.fragShader);
    gl.linkProgram(this.program);
  }
  getAttribLocation(variableName) {
    let loc = gl.getAttribLocation(this.program, variableName);
    this.attribLocations[variableName] = loc;
    return loc;
  }
}
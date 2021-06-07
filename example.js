import {Poly} from "./poly.js";
import {Layer} from "./layer.js";
import {Shader} from "./renderer.js";
import {Util} from "./util.js";
import {Camera} from "./camera.js";

let poly, shader, vertexBuffer, mvpLoc, colLoc, camera, mvp;
// let fBuffer, fTex;

// let clear_color; 

class ExampleLayer extends Layer {
  constructor() {
    super("ExampleLayer");
  }
  imgLoader() {

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this.image);
      gl.generateMipmap(gl.TEXTURE_2D);
      console.log(`${this.image.src} loaded!`);
  }
  onAttach() {
    // ImGui Testing

    // ImGui.default();

    // ImGui.CreateContext();
    // ImGui_Impl.Init(canvas);

    // ImGui.StyleColorsClassic();
    // clear_color = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    
    this.image = new Image();
    this.image.src = "obamid.png";
    this.image.addEventListener('load', this.imgLoader.bind(this));


    // Create camera
    mvp = mat4.create();
    camera = new Camera(
      this.projMatrix, 
      70, 
      1, 
      0.1, 1000);
    this.shader = new Shader("#vertex", "#fragment");

    // Framebuffer Testing

    // fBuffer = gl.createFramebuffer();
    // gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer);

    // fTex = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, fTex);
  
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB565,
    //               128, 128, 0,
    //               gl.RGBA, gl.UNSIGNED_SHORT_5_6_5, null);
  
    // // set the filtering so we don't need mips
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTex, 0);

    // TODO: Move below code to a mesh class.

    // Creating vertex buffers.
    let vertices = new Float32Array([
       1.0, 1.0, 1.0, // top right
      -1.0, 1.0, 1.0, // top left
      -1.0,-1.0, 1.0, // bottom left
       1.0,-1.0, 1.0, // bottom right
    ]);
    let uvs = new Float32Array([
      1.0, 0.0, 
      0.0, 0.0,
      0.0, 1.0, 
      1.0, 1.0,
    ]);
    let indices = new Int8Array([
      0,1,2,
      0,2,3,
    ]);

    this.vertexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // Create VAO
    this.colorQuadVao = gl.createVertexArray();
    gl.bindVertexArray(this.colorQuadVao);

    // Load indice data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW, 0);

    // Load vertice data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW, 0);
    let posLoc = this.shader.attribSpecs["a_Pos"].location;
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);

    // Load color data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW, 0);
    let uvLoc = this.shader.attribSpecs["a_Texcoord"].location;
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(uvLoc);



    this.texQuadVao = gl.createVertexArray();
    gl.bindVertexArray(this.texQuadVao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    // Load uniform data (mvp)
    this.shader.bind();
    mvpLoc = this.shader.uniformSpecs["u_MVP"].glLocation;
    colLoc = this.shader.uniformSpecs["u_Color"].glLocation;
  }

	onDetach() {
    console.log("ExampleLayer deattached!");
  }

	onUpdate(deltaMilliseconds) {
    this.shader.bind();

    camera.getViewProjectionMatrix(mvp);
    gl.uniformMatrix4fv(mvpLoc, false, mvp);

    gl.uniform4f(colLoc, 0.7, 1.0, 0.7, 1.0);

    gl.bindVertexArray(this.colorQuadVao);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer);
    // gl.viewport(0,0,100,100);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // gl.viewport(0,0,gl.drawingBufferWidth,
    //   gl.drawingBufferHeight);
    
    // // turn on scissor test
    // gl.enable(gl.SCISSOR_TEST);

    // // set the scissor rectangle
    // gl.scissor(10, 10, 60, 30);
    // gl.clearColor(1.0,0.5,0.0,1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // // turn off scissor test again
    // gl.disable(gl.SCISSOR_TEST);
  }

	// onDebug(deltaMilliseconds) {}
	// onEvent(event) {}
}

poly = new Poly({}, document.querySelector("#canvas"));
poly.start(new ExampleLayer());
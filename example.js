import {Poly} from "./poly.js";
import {Layer} from "./layer.js";
import {Shader} from "./renderer.js";
import {Util} from "./util.js";
import {Camera} from "./camera.js";

let poly, shader, vertexBuffer, mvpLoc, colLoc, tilingLoc, camera, mvp;
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
  textureFromPixelArray(dataArray, type, width, height) {
    let dataTypedArray = new Uint8Array(dataArray); // Don't need to do this if the data is already in a typed array
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, dataTypedArray);
    // Other texture setup here, like filter modes and mipmap generation
    return texture;
  }
  onAttach() {
    let vals = [
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
    ];
    this.texture = this.textureFromPixelArray(
      vals, gl.RGB, 4, 4);
    
    this.image = new Image();
    this.image.src = "texture.png";
    this.image.addEventListener('load', this.imgLoader.bind(this));


    // Create camera
    mvp = mat4.create();
    camera = new Camera(
      this.projMatrix, 
      70, 
      1, 
      0.1, 1000);
    this.shader = new Shader("#vertex", "#fragment");

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

    // Load UV data
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
    tilingLoc = this.shader.uniformSpecs["u_TilingFactor"].glLocation;
  }

	onDetach() {
    console.log("ExampleLayer deattached!");
  }

	onUpdate(deltaMilliseconds) {
    this.shader.bind();

    camera.getViewProjectionMatrix(mvp);
    gl.uniformMatrix4fv(mvpLoc, false, mvp);

    let val = Math.cos(Date.now()*0.005)*0.5+1;
    gl.uniform4f(colLoc, 1.0, val, val, 1.0);
    gl.uniform1f(tilingLoc, Math.sin(Date.now()*0.002)*2);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.bindVertexArray(this.colorQuadVao);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

  }

	// onDebug(deltaMilliseconds) {}
	// onEvent(event) {}
}

poly = new Poly({}, document.querySelector("#canvas"));
poly.start(new ExampleLayer());
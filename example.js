import {Poly} from "./poly.js";
import {Layer} from "./layer.js";
import {Shader} from "./renderer.js";
import {Util} from "./util.js";
import {OrthographicCamera} from "./camera.js";
import {Mesh} from "./mesh.js";

let poly, shader, vertexBuffer, mvpLoc, colLoc, tilingLoc, camera, vp, mpos, mscale, mtrans, mvp;

class ExampleLayer extends Layer {
  constructor() {
    super("ExampleLayer");
  }
  // TODO: move all image and texture loading into new class.
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
    return texture;
  }
  onAttach() {

    // Load texture(s)
    let vals = [
      255,255,255,
    ];
    this.whiteTex = this.textureFromPixelArray(
      vals, gl.RGB, 1, 1);
    
    this.image = new Image();
    this.image.src = "corrupt.png";
    this.image.addEventListener('load', this.imgLoader.bind(this));

    // Create camera
    mpos = mat4.create();
    mscale = mat4.create();
    mtrans = mat4.create();
    mvp = mat4.create();
    camera = new OrthographicCamera(
      -16/9, 16/9,
      -1,1,
      -1,1);
    vp = camera.getViewProjectionMatrix();
    
    // Create and compile shader
    this.shader = new Shader("#vertex", "#fragment");

    this.mesh = new Mesh(this.shader);

    // Load uniform data (mvp)
    this.shader.bind();
    mvpLoc = this.shader.uniformSpecs["u_MVP"].glLocation;
    colLoc = this.shader.uniformSpecs["u_Color"].glLocation;
    tilingLoc = this.shader.uniformSpecs["u_TilingFactor"].glLocation;
  }

	onDetach() {
    // TODO: Delete / unbinds, everything else.
    console.log("ExampleLayer deattached!");
  }

	onUpdate(deltaMilliseconds) {
    this.shader.bind();

    let val = Math.sin(Date.now()*0.002);
    camera.setPos(val,0,0);

    gl.uniform1f(tilingLoc, 1);
    gl.bindTexture(gl.TEXTURE_2D, this.whiteTex);
    gl.bindVertexArray(this.mesh.vao);

    mat4.fromTranslation(mpos, vec3.fromValues(0,0,0));
    mat4.identity(mscale);
    mat4.multiply(mtrans, mscale, mpos);
    mat4.multiply(mvp, vp, mtrans);
    gl.uniformMatrix4fv(mvpLoc, false, mvp);
    gl.uniform4f(colLoc, 1.0, 0.7, 0.7, 1.0);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

    mat4.fromTranslation(mpos, vec3.fromValues(0, 0, 0));
    mat4.fromScaling(mscale, vec3.fromValues(0.5,0.2,1));
    mat4.multiply(mtrans, mscale, mpos);
    mat4.multiply(mvp, vp, mtrans);
    gl.uniformMatrix4fv(mvpLoc, false, mvp);
    gl.uniform4f(colLoc, 0.7, 0.7, 1.0, 1.0);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

  }

	// onDebug(deltaMilliseconds) {}
	onEvent(event) {
    camera.viewportResized(event.width,event.height);
  }
}

poly = new Poly({}, document.querySelector("#canvas"));
poly.start(new ExampleLayer());``
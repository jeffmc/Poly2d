import {Poly} from "./poly.js";
import {Layer} from "./layer.js";
import {Shader} from "./renderer.js";
import {Util} from "./util.js";

let poly, shader, vertexBuffer, mvpLoc, mvp;

class ExampleLayer extends Layer {
  constructor() {
    super("ExampleLayer");
  }
  onAttach() {
    this.shader = new Shader("#vertex", "#fragment");
    
    let vertsColors = new Float32Array([
       1.0, 0.9, 0.0, 1.0, 0.0, 1.0, 1.0,
      -1.0,-0.9, 0.0, 1.0, 1.0, 0.0, 1.0,
       0.4,-0.5, 0.0, 1.0, 1.0, 1.0, 1.0,
      -0.9, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      -0.5,-0.4, 0.0, 0.0, 1.0, 0.0, 1.0,
       0.9,-1.0, 0.0, 0.0, 0.0, 1.0, 1.0,
    ]);
    // let vertices = new Float32Array([
    //    1.0, 0.9, 0.0,
    //   -1.0,-0.9, 0.0,
    //    0.4,-0.5, 0.0,
    //   -0.9, 1.0, 0.0,
    //   -0.5,-0.4, 0.0,
    //    0.9,-1.0, 0.0,
    // ])
    // let colors = new Float32Array([
    //   1.0, 0.0, 1.0, 1.0,
    //   1.0, 1.0, 0.0, 1.0,
    //   1.0, 1.0, 1.0, 1.0,
    //   1.0, 0.0, 0.0, 1.0,
    //   0.0, 1.0, 0.0, 1.0,
    //   0.0, 0.0, 1.0, 1.0,
    // ])

    this.vertexBuffer = gl.createBuffer();
    // this.colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertsColors, gl.STATIC_DRAW, 0);
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW, 0);
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW, 0);

    this.shader.bind();
    let mvpLoc = this.shader.uniformSpecs["u_MVP"].glLocation;
    console.log(mvpLoc);
    let mvp = new Float32Array([
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0,
    ]);
    gl.uniformMatrix4fv(mvpLoc, false, mvp);
  }
	onDetach() {
    console.log("ExampleLayer deattached!");
  }
	onUpdate(deltaMilliseconds) {
    this.shader.bind();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    let posLoc = this.shader.attribSpecs["a_Pos"].location;
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(posLoc);
    let colLoc = this.shader.attribSpecs["a_Color"].location;
    gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 28, 12);
    gl.enableVertexAttribArray(colLoc);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
	// onDebug(deltaMilliseconds) {}
	// onEvent(event) {}
}

poly = new Poly({}, document.querySelector("#canvas"));
poly.start(new ExampleLayer());
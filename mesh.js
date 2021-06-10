export class Mesh { // Just a quad class for now
  constructor(_shader) {
    this.shader = _shader;
    // Creating vertex buffers.
    let vertices = new Float32Array([
       1.0, 1.0, 0.0, // top right
      -1.0, 1.0, 0.0, // top left
      -1.0,-1.0, 0.0, // bottom left
       1.0,-1.0, 0.0, // bottom right
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

    // Create and bind new VAO
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

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

    gl.bindVertexArray(null);
  }
  bind() {
    gl.bindVertexArray(this.vao);
  }
}
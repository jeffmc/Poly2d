export class Camera {
  constructor(fov, aspectRatio, nearPlane, farPlane) {
    this.viewMatrix = mat4.create();
    this.projMatrix = mat4.create();
    mat4.perspective(
      this.projMatrix, 
      fov, aspectRatio, nearPlane, farPlane
    );
    mat4.fromTranslation(
      this.viewMatrix,
      vec4.fromValues(0,0,1)
    )
  }
  getViewProjectionMatrix(vp) {
    mat4.fromTranslation(
      this.viewMatrix, 
      vec3.fromValues(
        0,
        0,
        Math.sin(Date.now()*0.004)*2+2
      )
    );
    mat4.fromRotation(
      this.projMatrix, 
      Date.now()*0.001, 
      vec3.fromValues(0,0,1));
    return mat4.multiply(vp, this.viewMatrix, this.projMatrix);
  }
  onResize() {
    // mat4.perspective(
    //   this.projMatrix, 
    //   70, 
    //   this.config.pWidth/this.config.pHeight, 
    //   0.1, 1000);
  }
  getTransform() {
    return this.transform;
  }
}
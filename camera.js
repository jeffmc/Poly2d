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
    // return mat4.multiply(vp, this.viewMatrix, this.projMatrix);
    return mat4.copy(vp, this.viewMatrix);
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
export class OrthographicCamera {
  constructor(left,right,bottom,top,near,far) {
    this.viewMatrix = mat4.create();
    this.projMatrix = mat4.create();
    this.vp = mat4.create();
    mat4.ortho(
      this.projMatrix,
      left,right,
      bottom,top,
      near,far);
    this.setPos(0,0,0);
  }
  getViewProjectionMatrix() {
    mat4.fromTranslation(
      this.viewMatrix, 
      vec3.fromValues(
        this.x,
        this.y,
        this.z,
      )
    );
    mat4.multiply(this.vp, this.viewMatrix, this.projMatrix);
    return this.vp;
  }
  setPos(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    mat4.fromTranslation(
      this.viewMatrix,
      vec4.fromValues(this.x,this.y,this.z)
    );
    mat4.multiply(this.vp, this.viewMatrix, this.projMatrix);
  }
  viewportResized(w,h) {
    mat4.ortho(
      this.projMatrix,
      -w/h,w/h,
      -1,1,
      -1,1);
    mat4.multiply(this.vp, this.viewMatrix, this.projMatrix);
  }
  getTransform() {
    return this.transform;
  }
}
export class Camera {
  constructor(cfg) {
    this.config = cfg;
    this.zoom = 1;
    this.centerX = 0;
    this.centerY = 0;
    this.transform = {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0,
    }
  }
  init() {
    // this.transform = new DOMMatrix([this.zoom,0,this.zoom,0,this.config.pWidth*(-0.5),this.config.pHeight*(-0.5)]);
    this.calculateMatrix();
  }
  calculateMatrix() {
    this.transform = {
      a: this.zoom,
      b: 0,
      c: 0,
      d: this.zoom,
      e: this.config.pWidth*0.5,
      f: this.config.pHeight*0.5,
    };
  }
  onResize() {
    this.calculateMatrix();
  }
  getTransform() {
    return this.transform;
  }
}
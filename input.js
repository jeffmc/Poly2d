export default class Input {
  constructor(cfg) {
    this.cfg = cfg;
    this.mouseX = 0;
    this.mouseY = 0;
  }

  init() {
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  onMouseMove(ev) {
    this.mouseX = ev.clientX;
    this.mouseY = ev.clientY;
    // console.log([this.mouseX,this.mouseY])
  }

  onKeyPress(ev) {
    
  }
}
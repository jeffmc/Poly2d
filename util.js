export default class Util {
  constructor(cfg, input) {
    this.cfg = cfg;
    this.input = input;
  }
  
  getSnappedCoords(x,y) {
    // Might want to look at a better solution for grid
    let xo = (this.cfg.pWidth % this.cfg.bin_size) / 2;
    let yo = (this.cfg.pHeight % this.cfg.bin_size) / 2;
    x += xo + this.cfg.bin_half - x % this.cfg.bin_size;
    y += yo + this.cfg.bin_half - y % this.cfg.bin_size;
    return [x,y];
  }

  getCursorCoords() {
    let z = this.cfg.snappingEnabled ? this.getSnappedCoords(this.input.mouseX, this.input.mouseY) : [this.input.mouseX, this.input.mouseY];
    return z;
  }
}
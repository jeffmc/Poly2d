export default class LineTool {
  constructor(cfg,util) {
    this.cfg = cfg;
    this.util = util;
    
    this.bx = -1;
    this.by = -1;
    this.segmenting = false;
  }
  mousePressed() {
    [cx,cy] = this.util.getCursorCoords();
    bx = cx;
    by = cy;
    this.segmenting = true;
  }
  mouseReleased() {
    [cx,cy] = this.util.getCursorCoords();
    segments.push([bx,by,cx,cy]);
    this.segmenting = false;
  }
  
  paintPlausibleSegment() {
    if (segmenting) {
      [px,py] = getCursorCoords();
      stroke(this.cfg.color.cursor)
      strokeWeight(1);
      line(bx,by,px,py);
    }
  }
}

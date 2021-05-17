export class Layer {
  constructor(debugName) {
    this.debugName = debugName;
  }
  
  onAttach() {}
	onDetach() {}
	onUpdate(timestep) {}
	onDebugRender() {}
	onEvent(event) {}
  toString() {
    return this.debugName;
  }
}

// Example: (O = overlay, L = layer)
// 0 1 2 3 4 5 6 7 8 arr idx
// O O O O L L L L L obj type
// first added overlay will maintain 0th index until popped.
export class LayerStack {
  constructor(debugName) {
    this.debugName = debugName;
    this.layers = [];
    this.layerIndex = 0;
  }
  pushLayer(layer) {
    this.layers.push(layer);
    layer.onAttach();
  }
	pushOverlay(overlay) {
    this.layers.splice(this.layerIndex,0,overlay);
    this.layerIndex++;
    overlay.onAttach();
  }
	popLayer(layer) {
    let fi = this.layers.indexOf(overlay);
    let li = this.layers.lastIndexOf(overlay);
    if (fi != li) {
      let msg = `ERROR: LAYER INDEXED MULTIPLE TIMES IN STACK (${layer.debugName})`;
      alert(msg);
      console.error(msg);
      return;
    }
    layer.onDetach();
    this.layers.splice(fi,1);
  }
	popOverlay(overlay) {
    let fi = this.layers.indexOf(overlay);
    let li = this.layers.lastIndexOf(overlay);
    if (fi != li) {
      let msg = `ERROR: LAYER INDEXED MULTIPLE TIMES IN STACK (${overlay.debugName})`;
      alert(msg);
      console.error(msg);
      return;
    }
    overlay.onDetach();
    this.layers.splice(fi,1);
    this.layerIndex--;
  }
  toString() {
    return `${this.debugName}: ${this.layers.join(", ")}`;
  }
}
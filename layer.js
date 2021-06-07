export class Layer {
  constructor(debugName) {
    this.debugName = debugName;
  }
  
  onAttach() {}
	onDetach() {}
	onUpdate(deltaMilliseconds) {}
	onDebug(deltaMilliseconds) {}
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
    let idx = this.layers.indexOf(layer);
    if (idx >= this.layerIndex) {
      layer.onDetach();
      this.layers.splice(idx,1);
    }
  }
	popOverlay(overlay) {
    let idx = this.layers.indexOf(overlay);
    if (idx < this.layerIndex) {
      overlay.onDetach();
      this.layers.splice(idx,1);
      this.layerIndex--;
    }
  }
}
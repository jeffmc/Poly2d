export class Event {
  constructor(eventCategory, eventType, data) {
    this.handled = false;
    // eventCategory = "CanvasEvent" "MouseEvent"
    this.eventCategory = eventCategory || "UnassignedEventCategory";
    // eventType = "CanvasResize" "MouseClick"
    this.eventType = eventType || "UnassignedEventType";
    Object.assign(this, data);
  }
  toString() {
    return this.name;
  }
}

export class EventDispatcher {
  // returns whether event was dispatched or not.
  static dispatch(ev, handler) {
    if (ev.eventType === handler.eventType || handler.eventType === "*") {
      ev.handled |= handler.handle(ev);
      return true;
    }
    return false;
  }
}

export class EventHandler {
  constructor(eventCategory, eventType, func, name) {
    this.handled = false;
    this.eventCategory = eventCategory || "UnassignedEventCategory";
    this.eventType = eventType || "UnassignedEventType";
    this.func = func;
    this.name = name || "UnnamedEventHandler";
  }
  handle(event) {
    return this.func(event);
  }
}
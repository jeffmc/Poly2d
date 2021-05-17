export class Event {
  constructor(eventCategory, eventType, name) {
    this.handled = false;
    this.eventCategory = eventCategory || "UnassignedEventCategory";
    this.eventType = eventType || "UnassignedEventType";
    this.name = name || "UnnamedEvent";
  }
  toString() {
    return this.name;
  }
}

// returns whether event was handled or not.
export class EventDispatcher {
  constructor(event) {
    this.event = event;
  }
  dispatch(handler) {
    if (this.event.eventType === handler.eventType) {
      this.event.handled |= handler.handle(this.event);
      return true;
    }
    return false;
  }
}

// bind func parameter when passing to maintain sanity.
export class EventHandler {
  constructor(eventCategory, eventType, func, name) {
    this.handled = false;
    this.eventCategory = eventCategory || "UnassignedEventCategory";
    this.eventType = eventType || "UnassignedEventType";
    this.func = func;
    this.name = name || "UnnamedEvent";
  }
  handle(event) {
    return this.func(event);
  }
}
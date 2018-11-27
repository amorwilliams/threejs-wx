export default class Full2D {
  constructor(options) {
    this.texture = {};
    this.material = {};
    this.geometry = {};
    this.obj = {};
    this.canvas = {};
    this.context = {};
    this._touchInfo = { trackingID: -1, maxDy: 0, maxDx: 0 };
    this.options = Object.assign({}, {}, options);
  }
}

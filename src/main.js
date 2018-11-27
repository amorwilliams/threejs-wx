import * as THREE from 'three';
import Stats from './stats';
import Game from './Game';

export default class Main {
  constructor() {
    // TODO 不加这一句打开可能会短暂黑屏
    // canvas.getContext('webgl')

    var system = wx.getSystemInfoSync() || {};
    var isIPhone = system.platform == 'ios';

    // 渲染器  
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, preserveDrawingBuffer: true });
    this.renderer.shadowMap.enabled = true
    this.renderer.sortObjects = false
    // 设置设备像素比达到抗锯齿效果
    this.renderer.setPixelRatio(1)
    this.renderer.setPixelRatio(window.devicePixelRatio ? (isIPhone ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio) : 1);
    this.renderer.setClearColor(0xbfd1e5);
    // 由于使用多个不同的摄像机 这里关闭自动清除
    // this.renderer.autoClear = false

    if (wx.getLaunchOptionsSync) {
      var options = wx.getLaunchOptionsSync();
      this.game = new Game(this.renderer, options);
    } else {
      this.game = new Game(this.renderer);
    }

    this.stats = new Stats(this.game);
    this.initRequestAnimationFrame();
  }

  initRequestAnimationFrame() {
    this.lastFrameTime = Date.now();
    var oRequestAnimation = window.requestAnimationFrame;
    var frameCallbacks = [];
    var lastestFrameCallback = void 0;

    function requestAnimationFrameHandler() {
      var _frameCallbacks = [];
      var _lastestFrameCallback = lastestFrameCallback;

      frameCallbacks.forEach(function (cb) {
        _frameCallbacks.push(cb);
      });
      lastestFrameCallback = undefined;
      frameCallbacks.length = 0;

      _frameCallbacks.forEach(function (cb) {
        typeof cb === 'function' && cb();
      });

      if (typeof _lastestFrameCallback === 'function') {
        _lastestFrameCallback();
      }

      oRequestAnimation(requestAnimationFrameHandler);
    }

    window.requestAnimationFrame = function (callback, isLastest) {
      if (!isLastest) {
        frameCallbacks.push(callback);
      } else {
        lastestFrameCallback = callback;
      }
    };

    requestAnimationFrameHandler();

    this.animate();
  }

  animate() {
    this.stats.begin();
    var now = Date.now();
    var tickTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    requestAnimationFrame(this.animate.bind(this), true);
    if (tickTime > 100) return;
    this.game.update(tickTime / 1000);
    this.stats.end();
  }
}

new Main();

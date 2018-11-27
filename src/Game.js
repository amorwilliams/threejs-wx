import * as THREE from 'three';
import * as config from './config';
import Ground from './objects/Ground';
import Wave from './objects/Wave';
import Block from './objects/Block';
import Full2D from './ui/Full2D';

const TIMEOUT = 9000;
const SERVERCONFIG = 60000;
// const SERVERCONFIG = 1000
const SYCTIME = 10000;
const REPORTERTIMEOUT = 60002;
// const REPORTERTIMEOUT = 1000
var system = wx.getSystemInfoSync() || {};
var isIPhone = system.platform == 'ios';
var model = system.model;

export default class Game {
  constructor(renderer, options) {
    this.options = options;
    this.renderer = renderer;

    this.init();

    wx.setKeepScreenOn && wx.setKeepScreenOn({
      keepScreenOn: true
    })
  }

  init() {
    /**
         * 数据上报
         */

    /**
         * 数据初始化
         */

    /**
         * 初始化场景
         */
    this.scene = new THREE.Scene();
    //this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    var frustumSize = config.FRUSTUMSIZE;
    var aspect = config.WIDTH / config.HEIGHT;
    this.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, -10, 85);
    this.camera.position.set(-17, 30, 26);
    this.camera.lookAt(new THREE.Vector3(13, 0, -4));
    this.scene.add(this.camera);

    // var CameraHelper = new THREE.CameraHelper(this.camera);
    // this.scene.add(CameraHelper);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, preserveDrawingBuffer: true });
    window.renderer = this.renderer;
    this.renderer.sortObjects = false
    this.renderer.setPixelRatio(1)
    this.renderer.setPixelRatio(window.devicePixelRatio ? (isIPhone ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio) : 1);

    // 坐标轴
    var AxesHelper = new THREE.AxesHelper(1000);
    this.scene.add(AxesHelper);

    if (isIPhone && (model.indexOf('iPhone 4') >= 0 || model.indexOf('iPhone 5') >= 0 || system.system.indexOf('iOS 9') >= 0 || system.system.indexOf('iOS 8') >= 0 || model.indexOf('iPhone 6') >= 0 && model.indexOf('iPhone 6s') < 0)) {
      this.renderer.shadowMap.enabled = false;
      config.GAME.canShadow = false;
      this.renderer.setPixelRatio(1.5);
      //wx.setPreferredFramesPerSecond && wx.setPreferredFramesPerSecond(45); 
    } else if (typeof system.benchmarkLevel != 'undefined' && system.benchmarkLevel < 5 && system.benchmarkLevel != -1) {
      config.GAME.canShadow = false;
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(window.devicePixelRatio ? isIPhone ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio : 1);
    } else {
      //GAME.canShadow = false;
      this.renderer.setPixelRatio(window.devicePixelRatio ? isIPhone ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio : 1);
      this.renderer.shadowMap.enabled = true;
    }
    this.renderer.setSize(config.WIDTH, config.HEIGHT);
    this.renderer.localClippingEnabled = true;
    // this.renderer.setClearColor( 0x000000, 0 );

    /**
         * 地面
         */
    this.ground = new Ground();
    this.ground.obj.position.z = -84;
    //this.ground.obj.rotation.x = -0.8;
    // window.rrr = this.ground.obj.position;

    this.camera.add(this.ground.obj);

    /**
         * Wave
         */
    this.waves = [];
    for (let i = 0; i < 4; i++) {
      var wave = new Wave();
      this.waves.push(wave);
      wave.obj.visible = false;
      this.scene.add(wave.obj);
    }

    /**
         * Combo
         */
    var basicMaterial = new THREE.MeshBasicMaterial({ color: 0xF5F5F5 });
    this.combo = new THREE.Mesh(new THREE.CircleGeometry(0.6, 40), basicMaterial);
    this.combo.name = 'combo';
    this.combo.position.x = -50;
    this.combo.rotation.x = -Math.PI / 2;
    this.scene.add(this.combo);

    if (this.renderer.shadowMap.enabled) {
      this.shadowTarget = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), basicMaterial);
      this.shadowTarget.visible = false;
      this.shadowTarget.name = 'shadowTarget';
      this.scene.add(this.shadowTarget);
    }

    this.currentBlock = new Block(1, 2);
    // this.currentBlock.glow();
    this.scene.add(this.currentBlock.obj);

    this.full2D = new Full2D({
      camera: this.camera,
      // -- 返回微信
      onReturnWechat: function onReturnWechat() {
        wx.exitMiniProgram();
      },
      // -- 纯分享
      onClickPureShare: function onClickPureShare(type) {
        // (0, _shareApp.pureShare)(type, _this3.gameModel.currentScore);
      }
    })

    this.addLight();
  }

  resetScene() {


    for (var i = 0, len = this.waves.length; i < len; ++i) {
      this.waves[i].reset();
    }

    wx.triggerGC && wx.triggerGC();
  }

  addLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.28);
    this.shadowLight.position.set(0, 15, 10);
    if (this.renderer.shadowMap.enabled) {
      this.shadowLight.castShadow = true;
      this.shadowLight.target = this.shadowTarget;
      this.shadowLight.shadow.camera.near = 5;
      this.shadowLight.shadow.camera.far = 30;
      this.shadowLight.shadow.camera.left = -10;
      this.shadowLight.shadow.camera.right = 10;
      this.shadowLight.shadow.camera.top = 10;
      this.shadowLight.shadow.camera.bottom = -10;
      this.shadowLight.shadow.mapSize.width = 512;
      this.shadowLight.shadow.mapSize.height = 512;
      var shadowGeometry = new THREE.PlaneGeometry(65, 25);
      this.shadowGround = new THREE.Mesh(shadowGeometry, new THREE.ShadowMaterial({ transparent: true, color: 0x000000, opacity: 0.3 }));
      this.shadowGround.receiveShadow = true;
      //this.shadowGround.position.z = 0;
      this.shadowGround.position.x = -25;
      this.shadowGround.position.y = -18;
      this.shadowGround.position.z = -15;
      this.shadowGround.rotation.x = -Math.PI / 2;
      this.shadowLight.add(this.shadowGround);
    }
    //this.shadowLight.shadow.radius = 1024;
    // var helper = new THREE.CameraHelper(this.shadowLight.shadow.camera);
    // this.scene.add( helper );

    // var light = new THREE.DirectionalLight(0xffffff, 0.15);
    // light.position.set(-5, 2, 20);
    // this.scene.add(light);

    //this.scene.add(hemisphereLight);
    this.scene.add(this.shadowLight);

    this.scene.add(ambientLight);
  }

  update(tt) {

    // this.camera.translateX(-0.1);

    if (this.renderer.shadowMap.enabled) {
      this.shadowTarget.position.x = this.bottle.obj.position.x;
      this.shadowTarget.position.z = this.bottle.obj.position.z;
      this.shadowLight.position.x = this.bottle.obj.position.x + 0;
      this.shadowLight.position.z = this.bottle.obj.position.z + 10;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

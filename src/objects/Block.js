import * as THREE from 'three';
import * as config from '../config';

var colors = {
  green: 0x619066,
  white: 0xeeeeee,
  lightGreen: 0x7ba980,
  gray: 0x9e9e9e,
  black: 0x6d6d6d,
  lightGray: 0xdbdbdb,
  lightBlack: 0xcbcbcb,
  brown: 0x676767,
  middleLightGreen: 0x774a379,
  middleLightGray: 0xbbbbbb,
  middleLightBlack: 0x888888
};

var biggerGeometry = new THREE.BoxGeometry(config.BLOCK.radius * 2 + 0.02, config.BLOCK.height + 0.04, config.BLOCK.radius * 2 + 0.02);
var staticGeometry = new THREE.BoxGeometry(config.BLOCK.radius * 2, config.BLOCK.height, config.BLOCK.radius * 2);
var shadowGeometry = new THREE.PlaneGeometry(11, 11);
// var stripeMaterial = new THREE.MeshBasicMaterial({ map: config.loader.load('res/stripe.png') });
var customMaterial = config.GAME.canShadow ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;

export default class Block {
  constructor(type, number) {
    //this.radiusSegments = BLOCK.radiusSegments[Math.floor(Math.random() * BLOCK.radiusSegments.length)];
    //this.geometry = new THREE.CylinderGeometry(BLOCK.radius, BLOCK.radius, BLOCK.height, this.radiusSegments);	
    //this.colors = ['pink', 'cyan', 'yellowBrown', 'purple', 'orange'];
    //this.material = new THREE.MeshLambertMaterial({ color: COLORS[this.colors[Math.floor(5 * Math.random())]], shading: THREE.FlatShading });
    //this.obj = new THREE.Mesh(this.geometry, this.material);
    //this.obj.castShadow = true;
    this.radius = config.BLOCK.radius;
    this.status = 'stop';
    this.scale = 1;
    this.type = 'green';
    this.types = ['green', 'black', 'gray'];
    this.radiusScale = 1;
    //this.obj.castShadow = true;
    //this.obj.receiveShadow = true;
    //if (this.radiusSegments === 4) this.obj.rotation.y = Math.PI / 4;
    //this.obj.scale.set(this.radiusScale, 1, this.radiusScale);
    this.obj = new THREE.Object3D();
    this.obj.name = 'block';
    this.body = new THREE.Object3D();

    if (type <= 8 || type == 27) {
      this.greenMaterial = new THREE.MeshLambertMaterial({ color: colors.green });
      this.whiteMaterial = new THREE.MeshLambertMaterial({ color: colors.white });
    }

    this.shadowWidth = 11;
    if (type == 2 || type == 7) {
      this.shadow = new THREE.Mesh(shadowGeometry, config.desk_shadow);
      this.shadow.position.set(0, -config.BLOCK.height / 2 - 0.001 * type, -4.5);
      this.shadow.scale.y = 1.2;
    } else if (type == 3 || type == 21 || type == 27 || type == 28 || type == 29 || type == 31) {
      this.shadow = new THREE.Mesh(shadowGeometry, config.cylinder_shadow);
      this.shadow.position.set(-0.1, -config.BLOCK.height / 2 - 0.001 * type, -2.8);
      this.shadow.scale.y = 1.4;
      this.shadow.scale.x = 1;
    } else {
      this.shadow = new THREE.Mesh(shadowGeometry, config.shadow);
      this.shadow.position.set(-0.74, -config.BLOCK.height / 2 - 0.001 * type, -2.73);
      this.shadow.scale.y = 1.4;
    }

    this.shadow.rotation.x = -Math.PI / 2;
    this.order = type;
    this.radiusSegments = 4;
    this.height = config.BLOCK.height;
    this.canChange = true;

    if (type == 0) {
      var materials = [this.greenMaterial, this.whiteMaterial];
      var totalGeometry = new THREE.Geometry();
      var innerHeight = 3;
      var outerHeight = (config.BLOCK.height - innerHeight) / 2;
      var outerGeometry = new THREE.BoxGeometry(config.BLOCK.radius * 2, outerHeight, config.BLOCK.radius * 2);
      this.geometry = outerGeometry;
      var innerGeometry = new THREE.BoxGeometry(config.BLOCK.radius * 2, innerHeight, config.BLOCK.radius * 2);
      this.merge(totalGeometry, outerGeometry, 0, [{ x: 0, y: -innerHeight / 2 - outerHeight / 2, z: 0 }, { x: 0, y: innerHeight / 2 + outerHeight / 2, z: 0 }]);
      this.merge(totalGeometry, innerGeometry, 1, [{ x: 0, y: 0, z: 0 }]);
      this.hitObj = new THREE.Mesh(totalGeometry, materials);
    } else if (type == 1) {
      var materials = [this.greenMaterial, this.whiteMaterial];
      var totalGeometry = new THREE.Geometry();
      var bottomHeight = config.BLOCK.height / 5;
      var geometry = new THREE.BoxGeometry(config.BLOCK.radius * 2, bottomHeight, config.BLOCK.radius * 2);
      this.geometry = geometry;
      this.merge(totalGeometry, geometry, 0, [{ x: 0, y: 0, z: 0 }, { x: 0, y: -2 * bottomHeight, z: 0 }, { x: 0, y: 2 * bottomHeight, z: 0 }]);
      this.merge(totalGeometry, geometry, 1, [{ x: 0, y: -bottomHeight, z: 0 }, { x: 0, y: bottomHeight, z: 0 }]);
      this.hitObj = new THREE.Mesh(totalGeometry, materials);
    } else if (type == 2) {
      var materials = [this.greenMaterial, this.whiteMaterial];
      var totalGeometry = new THREE.Geometry();
      this.radiusSegments = 50;
      var bottomHeight = 5;
      var topHeight = config.BLOCK.height - bottomHeight;
      var bottomGeometry = new THREE.CylinderGeometry(config.BLOCK.radius - 4, config.BLOCK.radius - 2, bottomHeight, 50);
      var topGeometry = new THREE.CylinderGeometry(config.BLOCK.radius, config.BLOCK.radius, topHeight, 50);
      this.geometry = topGeometry;
      this.merge(totalGeometry, bottomGeometry, 1, [{ x: 0, y: -(config.BLOCK.height - bottomHeight) / 2, z: 0 }]);
      this.merge(totalGeometry, topGeometry, 0, [{ x: 0, y: bottomHeight + topHeight / 2 - config.BLOCK.height / 2, z: 0 }]);
      this.hitObj = new THREE.Mesh(totalGeometry, materials);
    } else if (type == 15) {
      var geometry = new THREE.BoxGeometry(config.BLOCK.radius * 2, this.height, config.BLOCK.radius * 2);
      this.map = config.loader.load('res/bag.png');
      var material = new THREE.MeshLambertMaterial({
        map: this.map
      });
      this.glowMap = config.loader.load('res/glow_bag.png');
      this.hitObj = new THREE.Mesh(geometry, material);
    } else if (type == -1) {
      var color = [0xee6060, 0xe4965e, 0xefbf57, 0x8ab34e, 0x71b4c4, 0x637cbd, 0xa461d4];
      var geometry = biggerGeometry;
      var material = new THREE.MeshLambertMaterial({ color: color[number], transparent: true });
      this.hitObj = new THREE.Mesh(geometry, material);
      var grayGeometry = new THREE.BoxGeometry(config.BLOCK.radius * 2, config.BLOCK.height, config.BLOCK.radius * 2);
      this.mapUv(100, 88, grayGeometry, 2, 0, 0, 5, 5);
      var gray = new THREE.Mesh(grayGeometry, config.grayMaterial);
      if (number == 0) gray.receiveShadow = true;
      this.body.add(gray);
      var planeGeometry = new THREE.PlaneGeometry(4, 8);
      var x1, y1, x2, y2;
      x1 = 64 * (number % 4);
      x2 = x1 + 64;
      y1 = parseInt(number / 4) * 128;
      y2 = y1 + 128;
      this.mapUv(256, 256, planeGeometry, 0, x1, y2, x2, y1);
      var plane = new THREE.Mesh(planeGeometry, config.numberMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.rotation.z = -Math.PI / 2;
      plane.position.y = config.BLOCK.height / 2 + 0.05;
      this.body.add(plane);
      this.obj.scale.set(0.7, 1, 0.7);
    }

    this.shadow.initZ = this.shadow.position.z;
    this.hitObj.receiveShadow = true;
    this.hitObj.name = 'hitObj';
    this.body.add(this.hitObj);
    this.hitObj.matrixAutoUpdate = false;
    this.shadow.initScale = this.shadow.scale.y;
    this.body.position.y = config.BLOCK.height / 2 - this.height / 2;
    this.obj.add(this.shadow);
    this.obj.add(this.body);
  }

  merge(totalGeometry, geometry, index, positions) {
    for (var i = 0, len = geometry.faces.length; i < len; ++i) {
      geometry.faces[i].materialIndex = 0;
    }
    var mesh = new THREE.Mesh(geometry);
    for (var i = 0, len = positions.length; i < len; ++i) {
      mesh.position.set(positions[i].x, positions[i].y, positions[i].z);
      mesh.updateMatrix();
      totalGeometry.merge(mesh.geometry, mesh.matrix, index);
    }
  }

  mapUv(textureWidth, textureHeight, geometry, faceIdx, x1, y1, x2, y2, flag) {
    var tileUvW = 1 / textureWidth;
    var tileUvH = 1 / textureHeight;
    if (geometry.faces[faceIdx] instanceof THREE.Face3) {
      var UVs = geometry.faceVertexUvs[0][faceIdx * 2];
      if (faceIdx == 4 && !flag) {
        UVs[0].x = x1 * tileUvW; UVs[0].y = y1 * tileUvH;
        UVs[2].x = x1 * tileUvW; UVs[2].y = y2 * tileUvH;
        UVs[1].x = x2 * tileUvW; UVs[1].y = y1 * tileUvH;
      } else {
        UVs[0].x = x1 * tileUvW; UVs[0].y = y1 * tileUvH;
        UVs[1].x = x1 * tileUvW; UVs[1].y = y2 * tileUvH;
        UVs[2].x = x2 * tileUvW; UVs[2].y = y1 * tileUvH;
      }
      var UVs = geometry.faceVertexUvs[0][faceIdx * 2 + 1];
      if (faceIdx == 4 && !flag) {
        UVs[2].x = x1 * tileUvW; UVs[2].y = y2 * tileUvH;
        UVs[1].x = x2 * tileUvW; UVs[1].y = y2 * tileUvH;
        UVs[0].x = x2 * tileUvW; UVs[0].y = y1 * tileUvH;
      } else {
        UVs[0].x = x1 * tileUvW; UVs[0].y = y2 * tileUvH;
        UVs[1].x = x2 * tileUvW; UVs[1].y = y2 * tileUvH;
        UVs[2].x = x2 * tileUvW; UVs[2].y = y1 * tileUvH;
      }
    }
  }

  glow() {
    this.hitObj.material.map = this.glowMap;
  }
}

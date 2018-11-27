import * as THREE from 'three';
import * as config from '../config';

var geometry = new THREE.RingGeometry(config.WAVE.innerRadius, config.WAVE.outerRadius, config.WAVE.thetaSeg);

export default class Wave {
  constructor() {
    var material = new THREE.MeshBasicMaterial({ color: config.COLORS.pureWhite, transparent: true });
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.rotation.x = -Math.PI / 2;
    this.obj.name = 'wave';
    //this.obj.visible = false;
  }

  reset() {
    this.obj.scale.set(1, 1, 1);
    this.obj.material.opacity = 1;
    this.obj.visible = false;
  }
}

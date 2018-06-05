import Factory from './Factory';
import World from './World';

class ArcadePhysics {
	constructor(scene) {
		this.scene = scene;

		this.systems = scene.sys;

		this.config;

		this.world;

		this.add;

		this.boot();
	}

	boot () {
		this.world = new World(this.scene, this.config);
		this.add = new Factory(this.world);
	}

	start () {

	}

}

export default ArcadePhysics;

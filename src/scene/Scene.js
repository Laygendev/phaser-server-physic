/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import Systems from './Systems';

class Scene {
	constructor(config) {
		this.sys = new Systems(this, config);

		this.server;

		this.cache;

		this.registry;

		this.events;

		this.add;

		this.scene;

		this.children;

		this.data;

		this.load;

		this.time;

		this.physics;
	}

	update () {
	}
}

export default Scene;

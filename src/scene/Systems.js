/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import CONST from './const';
import EventEmitter from 'events';
import Settings from './Settings';

class Systems {
	constructor (scene, config) {
		this.scene = scene;

		this.server;

		this.config = config;

		this.settings = Settings.create(config);

		this.cache;

		this.registry;

		this.events = new EventEmitter();

		this.updateList;
	}

	init (server) {
		console.log('Systems.Init');
		this.settings.status = CONST.INIT;

		this.server = server;

		this.events.emit('boot', this);

		this.settings.isBooted = true;
	}

	start (data) {
		console.log('Systems.Start');
		if (data) {
			this.settings.data = data;
		}

		this.settings.status = CONST.START;

		this.settings.active = true;

		this.events.emit('start', this);
		this.events.emit('ready', this);
	}

	step (time, delta) {
		this.events.emit('preupdate', time, delta);

		this.events.emit('update', time, delta);

		this.scene.update.call(this.scene, time, delta);

		this.events.emit('postudpate', time, delta);
	}
}

export default Systems;

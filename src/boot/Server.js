/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import Config from './Config';
import EventEmitter from 'events';
import SceneManager from './../scene/SceneManager';
import TimeStep from './TimeStep';

/**
 * @classdesc
 * The Phaser.Server instance is the main controller for the entire Phaser Server. It is responsible
 * for handling the boot process, parsing the configuration values,
 * and setting-up all of physic Arcade Phaser systems.
 * Once that is complete it will start the Scene Manager and then begin the main game loop.
 *
 * @class Server
 * @memberOf Phaser
 * @constructor
 * @since 1.0.0
 *
 * @param {GameConfig} [GameConfig] - The configuration object for your Phaser Server instance.
 */
class Server {

	constructor(config) {
		this.config = new Config(config);

		this.isBooted = false;

		this.isRunning = false;

		this.events = new EventEmitter();

		// this.cache = CacheManager(this);

		// this.registry = new DataManager(this);

		this.scene = new SceneManager(this, this.config.sceneConfig);

		this.loop = new TimeStep(this, this.config);

		this.pendingDestroy = false;

		//  Server prêt. go Boot. Sans doute après le chargement des configs
		this.boot();
	}

	boot() {
		this.isBooted = true;

		console.log('Server.Boot')
		this.events.emit('boot');

		// this.events.once('ready', this.start, this);
		this.start();
	}

	start() {
		this.isRunning = true;

		this.loop.start(this.step);
	}

	step(server, time, delta) {
		if (this.pendingDestroy) {
			// return this.runDestroy();
		}

		server.scene.update(time, delta);
	}
};

export default Server;

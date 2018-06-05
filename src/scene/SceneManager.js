/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import CONST from './const';
import GetValue from './../utils/object/GetValue'
import Scene from './Scene';
import Systems from './Systems';

class SceneManager {
	constructor(server, sceneConfig) {

		this.server = server;

		this.keys = {};

		this.scenes = [];

		this._pending = [];

		this._start = [];

		this._queue = [];

		this._data = {};

		this.isProcessing = false;

		this.isBooted = false;

		if (sceneConfig) {
			if (!Array.isArray(sceneConfig)) {
				sceneConfig = [ sceneConfig ];
			}

			for (var i = 0; i < sceneConfig.length; i++) {
				this._pending.push({
					key: 'default',
					scene: sceneConfig[i],
					autoStart: (i === 0),
					data: {}
				});
			}
		}

		this.bootQueue();
		// server.events.once('ready', this.bootQueue, this);
	}

	bootQueue() {
		console.log('SceneManager.BootQueue');
		if (this.isBooted) {
			return;
		}

		var i;
		var entry;
		var key;
		var sceneConfig;

		for (i = 0; i < this._pending.length; i++) {
			entry = this._pending[i];

			key = entry.key;
			sceneConfig = entry.scene;

			var newScene;

			if (sceneConfig instanceof Scene) {
				newScene = this.createSceneFromInstance(key, sceneConfig);
			} else if (typeof sceneConfig === 'object') {
				newScene = this.createSceneFromObject(key, sceneConfig);
			} else if (typeof sceneConfig === 'function') {
				newScene = this.createSceneFromFunction(key, sceneConfig);
			}

			key = newScene.sys.settings.key;

			this.keys[key] = newScene;

			this.scenes.push(newScene);

			// Any data to inject ?
			if (this._data[key]) {
				newScene.sys.settings.data = this._data[key].data;

				if (this._data[key].autoStart) {
					entry.autoStart = true;
				}
			}

			if (entry.autoStart || newScene.sys.settings.active) {
				this._start.push(key);
			}
		}

		this._pending.length = 0;

		this._data = {};

		this.isBooted = true;

		for (i = 0; i < this._start.length; i++) {
			entry = this._start[i];

			this.start(entry);
		}

		this._start.length = 0;
	}

	processQueue () {
		var pendingLength = this._pending.length;
		var queueLength = this._queue.length;

		if (pendingLength === 0 && queueLength === 0) {
			return;
		}

		var i;
		var entry;

		if (pendingLength) {
			for (i = 0; i < pendingLength; i++) {
				entry = this._pending[i];

				this.add(entry.key, entry.scene, entry.autoStart, entry.data);
			}

			for (i = 0; i < this._start.length; i++) {
				entry = this._start[i];

				this.start(entry);
			}

			this._start.length = 0;
			this._pending.length = 0;

			return;
		}

		for (i = 0; i < this._queue.length; i++) {
			entry = this._queue[i];

			this[entry.op](entry.keyA, entry.keyB); // ?
		}

		this._queue.length = 0;
	}

	update (time, delta) {
		this.processQueue();

		this.isProcessing = true;

		for (var i = this.scenes.length - 1; i >= 0; i--) {
			var sys = this.scenes[i].sys;
			if (sys.settings.status === CONST.RUNNING) {
				sys.step(time, delta);
			}
		}
	}

	create (scene) {
		console.log('SceneManager.Create');
		var sys = scene.sys;
		var settings = sys.settings;

		if (scene.create) {
			scene.sys.settings.status = CONST.CREATING;

			scene.create.call(scene, scene.sys.settings.data);

			if (settings.isTransition) {
				// sys.events.emit('trans')
			}
		}

		settings.status = CONST.RUNNING;
	}

	getScene (key) {
		if (typeof key === 'string') {
			if (this.keys[key]) {
				return this.keys[key];
			}

		} else {
				for (var i = 0; i < this.scenes.length; i++) {
					if (key == this.scenes[i]) {
						return key;
					}
				}
		}

		return null;
	}

	createSceneFromInstance(key, sceneConfig) {
		var configKey = newScene.sys.settings.key;

		if (configKey !== '') {
			key = configKey;
		} else {
			newScene.sys.settings.key = key;
		}

		newScene.sys.init(this.server);
	}

	createSceneFromObject(key, sceneConfig) {
		console.log('SceneManager.createSceneFromObject');
		var newScene = new Scene(sceneConfig);

		var configKey = newScene.sys.settings.key;

		if (configKey !== '') {
			key = configKey;
		} else {
			newScene.sys.settings.key = key;
		}

		newScene.sys.init(this.server);

		var defaults = [ 'init', 'preload', 'create', 'update' ];

		for (var i = 0; i < defaults.length; i++) {
			var sceneCallback = GetValue(sceneConfig, defaults[i], null);

			if (defaults[i] === 'update' && !sceneCallback) {
				sceneCallback = NOOP;
			}

			if (sceneCallback) {
				newScene[defaults[i]] = sceneCallback;
			}
		}

		return newScene;
	}

	createSceneFromFunction(key, sceneConfig) {
		var newScene = new scene();

		if (newScene instanceof Scene) {
			var configKey = newScene.sys.settings.key;

			if (configKey !== '') {
				key = configKey;
			}

			if (this.keys.hasOwnProperty(key)) {
				throw new Error('Cannot add a Scene with duplicate key: ' + key);
			}

			return this.createSceneFromInstance(key, newScene);
		} else {
			newScene.sys = new Systems(newScene);

			newScene.sys.settings.key = key;

			newScene.sys.init(this.server);

			if (!newScene.update) {
				newScene.update = NOOP;
			}

			return newScene;
		}
	}

	start (key, data) {
		console.log('SceneManager.start');
		if (!this.isBooted) {
			this._data[key] = {
				autoStart: true,
				data: data
			};

			return this;
		}

		var scene = this.getScene(key);

		if (scene) {
			scene.sys.start(data);

			var loader;

			if (scene.sys.load) {
				loader = scene.sys.load;
			}

			this.bootScene(scene);
		}

		return this;
	}

	bootScene (scene) {
		console.log('SceneManager.BootScene');
		var sys = scene.sys;
		var settings = sys.settings;

		if (scene.init) {
			scene.init.class(scene, settings.data);

			if (settings.isTransition) {
				sys.events.emit('transitioninit', settings.transitionFrom, settings.transitionDuration);
			}
		}

		this.create(scene);

		var loader;

		console.log(sys.load);

		if (sys.load) {
			loader = sys.load;
			// loader.reset();
		}

		if (loader && scene.preload) {
			scene.preload.call(scene);

			if (loader.list.size === 0) {
			} else {
				settings.status = CONST.LOADING;

				loader.start();
			}
		}
	}

	loadComplete (loader) {
		var scene = loader.scene;

		if (this.game.sound.onBlurPausedSounds) {
			this.game.sound.unlock();
		}

		this.create(scene);
	}

	payloadComplete (loader) {
		console.log('SceneManager.PayloadComplete');
		this.bootScene(loader.scene);
	}
}

export default SceneManager;

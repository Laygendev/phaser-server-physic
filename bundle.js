'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EventEmitter = _interopDefault(require('events'));

function GetValue$1(source, key, defaultValue) {
	if (!source || typeof source === 'number') {
		return defaultValue;
	} else if (source.hasOwnProperty(key)) {
		return source[key];
	} else if (key.indexOf('.')) {
		var keys = key.split('.');
		var parent = source;
		var value = defaultValue;

		for (var i = 0; i < keys.length; i++) {
			if (parent.hasOwnProperty(keys[i])) {
				value = parent[keys[i]];

				parent = parent[keys[i]];
			} else {
				value = defaultValue;
				break;
			}
		}

		return value;
	} else {
		return defaultValue;
	}
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

var Config = function Config(config) {
	classCallCheck(this, Config);

	if (config === undefined) {
		config = {};
	}

	this.fps = GetValue$1(config, 'fps', 60);

	this.physics = GetValue$1(config, 'physic', {});
};

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

var Scene = function () {
		function Scene(config) {
				classCallCheck(this, Scene);

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

		createClass(Scene, [{
				key: 'update',
				value: function update() {
						console.log('Scene.update');
				}
		}]);
		return Scene;
}();

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

var SceneManager = function () {
	function SceneManager(server, sceneConfig) {
		classCallCheck(this, SceneManager);


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
				sceneConfig = [sceneConfig];
			}

			for (var i = 0; i < sceneConfig.length; i++) {
				this._pending.push({
					key: 'default',
					scene: sceneConfig[i],
					autoStart: i === 0,
					data: {}
				});
			}
		}

		server.events.once('ready', this.bootQueue, this);
	}

	createClass(SceneManager, [{
		key: 'bootQueue',
		value: function bootQueue() {
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
				} else if ((typeof sceneConfig === 'undefined' ? 'undefined' : _typeof(sceneConfig)) === 'object') {
					newScene = this.createSceneFromObject(key, sceneConfig);
				} else if (typeof sceneConfig === 'function') {
					newScene = this.createSceneFromFunction(key, sceneConfig);
				}

				key = newScene.sys.settings.key;

				this.keys[key] = newScene;

				this.scenes.push(newScene);

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
	}, {
		key: 'processQueue',
		value: function processQueue() {
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
	}, {
		key: 'update',
		value: function update(time, delta) {
			console.log('SceneManager.Update');
			console.log(time, delta, this.scenes.length);
			this.processQueue();

			this.isProcessing = true;

			for (var i = this.scenes.length - 1; i >= 0; i--) {
				var sys = this.scenes[i].sys;

				if (sys.settings.status === CONST.RUNNING) {
					console.log(time, delta);
					sys.step(time, delta);
				}
			}
		}
	}, {
		key: 'create',
		value: function create(scene) {
			var sys = scene.sys;
			var settings = sys.settings;

			if (scene.create) {
				scene.sys.settings.status = CONST.CREATING;

				scene.create.call(scene, scene.sys.settings.data);

				if (settings.isTransition) ;
			}

			settings.status = CONST.RUNNING;
		}
	}, {
		key: 'createSceneFromInstance',
		value: function createSceneFromInstance() {
			var configKey = newScene.sys.settings.key;

			if (configKey !== '') {
				key = configKey;
			} else {
				newScene.sys.settings.key = key;
			}

			newScene.sys.init(this.server);
		}
	}, {
		key: 'createSceneFromObject',
		value: function createSceneFromObject() {
			var newScene = new Scene(sceneConfig);

			var configKey = newScene.sys.settings.key;

			if (configKey !== '') {
				key = configKey;
			} else {
				newScene.sys.settings.key = key;
			}

			newScene.sys.init(this.server);

			var defaults$$1 = ['init', 'preload', 'create', ' update'];

			for (var i = 0; i < defaults$$1.length; i++) {
				var sceneCallback = GetValue(sceneCOnfig, defaults$$1[i], null);

				if (defaults$$1[i] === 'update' && !sceneCallback) {
					sceneCallback = NOOP;
				}

				if (sceneCallback) {
					newScene[defauts[i]] = sceneCallback;
				}
			}

			return newScene;
		}
	}, {
		key: 'createSceneFromFunction',
		value: function createSceneFromFunction() {
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
	}]);
	return SceneManager;
}();

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

/**
 * A NOOP (No Operation) callback function.
 *
 * Used internally by Phaser when it's more expensive to determine if a callback exists
 * than it is to just invoke an empty function.
 *
 * @function Phaser.Utils.NOOP
 * @since 3.0.0
 */
function NOOP$1() {
  //  NOOP from Phaser
}

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

var TimeStep = function () {
		function TimeStep(server, config) {
				classCallCheck(this, TimeStep);

				this.server = server;

				this.fps = GetValue$1(config, 'fps', 60);

				this.started = false;

				this.running = false;

				this.framesThisSecond = 0;

				this.callback = NOOP$1;

				this.time = 0;

				this.startTime = 0;

				this.lastTime = 0;

				this.frame = 0;

				this.delta = 0;

				this.deltaIndex = 0;

				this.deltaHistory = [];

				this.rawDelta = 0;

				this.interval;
		}

		createClass(TimeStep, [{
				key: 'start',
				value: function start(callback) {
						var _this = this;

						if (this.started) {
								return this;
						}

						this.started = true;
						this.running = true;

						this.startTime = Date.now();

						this.callback = callback;

						this.interval = setInterval(function () {
								_this.step(Date.now());
						}, 1000 / this.fps);
				}
		}, {
				key: 'step',
				value: function step(time) {
						this.frame++;

						this.rawDelta = time - this.lastTime;

						var idx = this.deltaIndex;

						var dt = time - this.lastTime;

						this.deltaIndex++;

						this.time += this.rawDelta;

						this.framesThisSecond++;

						this.callback(this.server, time, dt);

						this.lastTime = time;
				}
		}, {
				key: 'tick',
				value: function tick() {
						this.step(Date.now());
				}
		}, {
				key: 'stop',
				value: function stop() {
						this.running = false;
						this.started = false;

						return this;
				}
		}, {
				key: 'destroy',
				value: function destroy() {
						this.stop();

						clearInterval(this.interval);

						this.interval = null;

						this.callback = NOOP$1;

						this.server = null;
				}
		}]);
		return TimeStep;
}();

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

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

var Server = function () {
		function Server(config) {
				classCallCheck(this, Server);

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

		createClass(Server, [{
				key: 'boot',
				value: function boot() {
						this.isBooted = true;

						console.log('Server.Boot');
						this.events.emit('boot');

						// this.events.once('ready', this.start, this);
						this.start();
				}
		}, {
				key: 'start',
				value: function start() {
						this.isRunning = true;

						this.loop.start(this.step);
				}
		}, {
				key: 'step',
				value: function step(server, time, delta) {
						if (this.pendingDestroy) ;

						server.scene.update(time, delta);
				}
		}]);
		return Server;
}();

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

module.exports = Server;

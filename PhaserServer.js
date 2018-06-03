'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GetValue = require('./../utils/object/GetValue');

var _GetValue2 = _interopRequireDefault(_GetValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @author    Jimmy Latour <latour.jimmy@gmail.com>
                                                                                                                                                           * @copyright 2018 Jimmy.
                                                                                                                                                           * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
                                                                                                                                                           */

var Config = function Config(config) {
	_classCallCheck(this, Config);

	if (config === undefined) {
		config = {};
	}

	this.fps = (0, _GetValue2.default)(config, 'fps', 60);

	this.physics = (0, _GetValue2.default)(config, 'physic', {});
};

exports.default = Config;
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author    Jimmy Latour <latour.jimmy@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2018 Jimmy.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _SceneManager = require('./../scene/SceneManager');

var _SceneManager2 = _interopRequireDefault(_SceneManager);

var _TimeStep = require('./TimeStep');

var _TimeStep2 = _interopRequireDefault(_TimeStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
				_classCallCheck(this, Server);

				this.config = new _Config2.default(config);

				this.isBooted = false;

				this.isRunning = false;

				this.events = new _events2.default();

				// this.cache = CacheManager(this);

				// this.registry = new DataManager(this);

				this.scene = new _SceneManager2.default(this, this.config.sceneConfig);

				this.loop = new _TimeStep2.default(this, this.config);

				this.pendingDestroy = false;

				//  Server prêt. go Boot. Sans doute après le chargement des configs
				this.boot();
		}

		_createClass(Server, [{
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
						if (this.pendingDestroy) {
								// return this.runDestroy();
						}

						server.scene.update(time, delta);
				}
		}]);

		return Server;
}();

;

exports.default = Server;
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author    Jimmy Latour <latour.jimmy@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2018 Jimmy.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _GetValue = require('./../utils/object/GetValue');

var _GetValue2 = _interopRequireDefault(_GetValue);

var _NOOP = require('./../utils/NOOP');

var _NOOP2 = _interopRequireDefault(_NOOP);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeStep = function () {
		function TimeStep(server, config) {
				_classCallCheck(this, TimeStep);

				this.server = server;

				this.fps = (0, _GetValue2.default)(config, 'fps', 60);

				this.started = false;

				this.running = false;

				this.framesThisSecond = 0;

				this.callback = _NOOP2.default;

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

		_createClass(TimeStep, [{
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

						this.callback = _NOOP2.default;

						this.server = null;
				}
		}]);

		return TimeStep;
}();

exports.default = TimeStep;
'use strict';

var _Server = require('./boot/Server');

var _Server2 = _interopRequireDefault(_Server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var b = new _Server2.default({
  fps: 10
}); /**
     * @author    Jimmy Latour <latour.jimmy@gmail.com>
     * @copyright 2018 Jimmy.
     * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
     */
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector2 = function Vector2(x, y) {
	_classCallCheck(this, Vector2);

	this.x = x;
	this.y = y;
};

exports.default = Vector2;
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = require('./Math/Vector2');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Body = function () {
		function Body(width, height) {
				_classCallCheck(this, Body);

				this.width = width;
				this.height = height;

				this.transform = {
						x: 0,
						y: 0
				};

				this.position = new _Vector2.default(0, 0);
				this.prev = new _Vector2.default(0, 0);

				this.velocity = new _Vector2.default(0, 0);
				this.newVelocity = new _Vector2.default(0, 0);

				this.gravity = new _Vector2.default(0, 0);
				this.deltaMax = new _Vector2.default(0, 0);

				this.speed = 0;
				this.mass = 1;
				this.onCollide = false;

				this.touching = { none: true, up: false, down: false, left: false, right: false };
				this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

				this.blocked = { none: true, up: false, down: false, left: false, right: false };

				this.dirty = false;

				this._dx = 0;
				this._dy = 0;

				this._reset = true;

				console.log(this.position);
		}

		_createClass(Body, [{
				key: 'update',
				value: function update(delta) {
						this.dirty = true;

						//  Store and reset collision flags
						this.wasTouching.none = this.touching.none;
						this.wasTouching.up = this.touching.up;
						this.wasTouching.down = this.touching.down;
						this.wasTouching.left = this.touching.left;
						this.wasTouching.right = this.touching.right;

						this.touching.none = true;
						this.touching.up = false;
						this.touching.down = false;
						this.touching.left = false;
						this.touching.right = false;

						this.blocked.none = true;
						this.blocked.up = false;
						this.blocked.down = false;
						this.blocked.left = false;
						this.blocked.right = false;

						var sprite = this.transform;

						this.newVelocity.x = this.velocity.x * delta;
						this.newVelocity.y = this.velocity.y * delta;

						this.position.x += this.velocity.x;
						this.position.y += this.velocity.y;

						if (this._reset) {
								this.prev.x = this.position.x;
								this.prev.y = this.position.y;
						}

						this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

						this._dx = this.deltaX();
						this._dy = this.deltaY();

						this._reset = false;
				}
		}, {
				key: 'postUpdate',
				value: function postUpdate() {
						if (!this.dirty) {
								return;
						}

						this.dirty = false;

						this._dx = this.deltaX();
						this._dy = this.deltaY();

						if (this.deltaMax.x !== 0 && this._dx !== 0) {
								if (this._dx < 0 && this._dx < -this.deltaMax.x) {
										this._dx = -this.deltaMax.x;
								} else if (this._dx > 0 && this._dx > this.deltaMax.x) {
										this._dx = this.deltaMax.x;
								}
						}

						if (this.deltaMax.y !== 0 && this._dy !== 0) {
								if (this._dy < 0 && this._dy < -this.deltaMax.y) {
										this._dy = -this.deltaMax.y;
								} else if (this._dy > 0 && this._dy > this.deltaMax.y) {
										this._dy = this.deltaMax.y;
								}
						}

						this.reset = true;

						this.prev.x = this.position.x;
						this.prev.y = this.position.y;
				}
		}, {
				key: 'checkWorldBounds',
				value: function checkWorldBounds() {
						// var pos = this.position;
						// var bound = this.world.bounds;
						// var check = this.world.checkCollision;
				}
		}, {
				key: 'deltaX',
				value: function deltaX() {
						return this.position.x - this.prev.x;
				}
		}, {
				key: 'deltaY',
				value: function deltaY() {
						return this.position.y - this.prev.y;
				}
		}]);

		return Body;
}();

exports.default = Body;
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var CONST = {
	PENDING: 0,
	INIT: 1,
	START: 2,
	LOADING: 3,
	CREATING: 4,
	RUNNING: 5,
	PAUSED: 6,
	SLEEPING: 7,
	SHUTDOWN: 8,
	DESTROYED: 9
};

exports.default = CONST;
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

var Scene = function () {
		function Scene(config) {
				_classCallCheck(this, Scene);

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

		_createClass(Scene, [{
				key: 'update',
				value: function update() {
						console.log('Scene.update');
				}
		}]);

		return Scene;
}();

exports.default = Scene;
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author    Jimmy Latour <latour.jimmy@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2018 Jimmy.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Scene = require('./Scene');

var _Scene2 = _interopRequireDefault(_Scene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SceneManager = function () {
	function SceneManager(server, sceneConfig) {
		_classCallCheck(this, SceneManager);

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

	_createClass(SceneManager, [{
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

				if (sceneConfig instanceof _Scene2.default) {
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

				if (settings.isTransition) {
					// sys.events.emit('trans')
				}
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
			var newScene = new _Scene2.default(sceneConfig);

			var configKey = newScene.sys.settings.key;

			if (configKey !== '') {
				key = configKey;
			} else {
				newScene.sys.settings.key = key;
			}

			newScene.sys.init(this.server);

			var defaults = ['init', 'preload', 'create', ' update'];

			for (var i = 0; i < defaults.length; i++) {
				var sceneCallback = GetValue(sceneCOnfig, defaults[i], null);

				if (defaults[i] === 'update' && !sceneCallback) {
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

			if (newScene instanceof _Scene2.default) {
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

exports.default = SceneManager;
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author    Jimmy Latour <latour.jimmy@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright 2018 Jimmy.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Systems = function () {
		function Systems(scene, config) {
				_classCallCheck(this, Systems);

				this.scene = scene;

				this.server;

				this.config = config;

				this.settings = Settings.create(config);

				this.cache;

				this.registry;

				this.events;

				this.updateList;
		}

		_createClass(Systems, [{
				key: 'init',
				value: function init(server) {
						this.settings.status = _const2.default.INIT;

						this.server = server;

						this.events.emit('boot', this);

						this.settings.isBooted = true;
				}
		}]);

		return Systems;
}();

exports.default = Systems;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
function NOOP() {
  //  NOOP from Phaser
};

exports.default = NOOP;
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
function GetValue(source, key, defaultValue) {
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

exports.default = GetValue;
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

var World = function () {
	function World() {
		_classCallCheck(this, World);

		this.colliders = [];
	}

	_createClass(World, [{
		key: "loadCollisionFromTiled",
		value: function loadCollisionFromTiled() {}
	}, {
		key: "update",
		value: function update() {}
	}]);

	return World;
}();

exports.default = World;

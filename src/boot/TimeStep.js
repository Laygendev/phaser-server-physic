/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import GetValue from './../utils/object/GetValue'
import NOOP from './../utils/NOOP';

class TimeStep {
	constructor(server, config) {
		this.server = server;

		this.fps = GetValue(config, 'fps', 60);

		this.started = false;

		this.running = false;

		this.framesThisSecond = 0;

		this.callback = NOOP;

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

	start (callback) {
		if (this.started) {
			return this;
		}

		this.started = true;
		this.running = true;

		this.startTime = Date.now();

		this.callback = callback;

		this.interval = setInterval(() => {
			this.step(Date.now());
		}, 1000 / this.fps);
	}

	step (time) {
		this.frame++;

		this.rawDelta = time - this.lastTime;

		var idx = this.deltaIndex;

		var dt = (time - this.lastTime);

		this.deltaIndex++;

		this.time += this.rawDelta;

		this.framesThisSecond++;

		this.callback(this.server, time, dt);

		this.lastTime = time;
	}

	tick() {
		this.step(Date.now());
	}

	stop() {
		this.running = false;
		this.started = false;

		return this;
	}

	destroy() {
		this.stop();

		clearInterval(this.interval);

		this.interval = null;

		this.callback = NOOP;

		this.server = null;
	}
}

export default TimeStep;

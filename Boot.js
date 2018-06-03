/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import World from './World';
import Body from './Body';

class Boot {
	constructor() {
		this.World = new World();
		this.rate = 60;

		this.body = new Body(64, 64);
		console.log(this.body);

		setInterval( () => { this.update(); }, 1000 / this.rate);
	}

	update() {
		this.World.update();
	}
}

export default Boot;

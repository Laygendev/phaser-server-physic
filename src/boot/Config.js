/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import GetValue from './../utils/object/GetValue'

class Config {
	constructor(config) {
		if (config === undefined) { config = {}; }

		this.fps = GetValue(config, 'fps', 60);

		this.physics = GetValue(config, 'physic', {});

		this.sceneConfig = GetValue(config, 'scene', null);
	}


}

export default Config;

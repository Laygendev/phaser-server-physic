/**
 * @author    Jimmy Latour <latour.jimmy@gmail.com>
 * @copyright 2018 Jimmy.
 * @license   {@link https://github.com/layygdendev/phaser-3-multiplayer-simple/blob/master/license.txt|MIT License}
 */

import Server from './boot/Server'


var config = {
	fps: 10,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Server(config);

function preload ()
{
	console.log('preload');
	this.load.tilemapTiledJSON("map", "./level.json");
}

function create ()
{
}

function update (time, delta)
{
}


export default Server;

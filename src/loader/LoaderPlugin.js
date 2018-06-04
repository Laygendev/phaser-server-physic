import CONST from './const';
import TilemapJSONFile from './filetypes/TilemapJSONFile';

class LoaderPlugin {

	constructor(scene) {
		// var serverConfig = scene.sys.server.config;
		// var sceneConfig = scene.sys.settings.loader;

		this.scene = scene;

		this.systems = scene.sys;

		this.list = [];
		this.inflight = [];

		this.totalToLoad = 0;

		this.progress = 0;

		this.totalFailed = 0;

		this.totalComplete = 0;

		this.state = CONST.LOADER_IDLE;
	}

	boot () {

	}

	addFile (file) {
		if (!Array.isArray(file)) {
			file = [ file ];
		}

		for (var i = 0; i < file.length; i++) {
			var item = file[i];

			this.list.push(item);

			this.emit('addFile', item.key, item.type, this, item);

			if (this.isLoading()) {
				this.totalToLoad++;
				this.updateProgress();
			}
		}
	}

	updateProgress () {
		this.progress = 1 - ((this.list.length + this.inflight.length) / this.totalToLoad);

		this.emit('progress', this.progress);
	}


	tilemapTiledJSON (key, path) {
		this.addFile(new TilemapJSONFile(this, key, path));
	}

	destroy () {

	}
}

export default LoaderPlugin;

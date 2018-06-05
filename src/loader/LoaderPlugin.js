import CONST from './const';
import EventEmitter from 'events';
import TilemapJSONFile from './filetypes/TilemapJSONFile';

class LoaderPlugin extends EventEmitter {

	constructor(scene) {
		super();
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

			// this.emit('addFile', item.key, item.type, this, item);

			if (this.isLoading()) {
				this.totalToLoad++;
				this.updateProgress();
			}
		}
	}

	updateProgress () {
		this.progress = 1 - ((this.list.length + this.inflight.length) / this.totalToLoad);
	}

	isLoading () {
		return (this.state === CONST.LOADER_LOADING || this.state === CONST.LOADER_PROCESSING);
	}

	isReady () {
		return (this.state === CONST.LOADER_IDLE || this.state === CONST.LOADER_COMPLETE);
	}

	start () {
		if (!this.isReady()) {
			return;
		}

		this.progress = 0;

		this.totalFailed = 0;
		this.totalComplete = 0;
		this.totalToLoad = this.list.length;

		if ( this.list.length === 0 ) {
			this.loadComplete();
		} else {
			this.state = CONST.LOADER_LOADING;

			this.updateProgress();

			this.checkLoadQueue();
		}
	}

	checkLoadQueue () {
		for (var key in this.list) {
			var file = this.list[key];

			if (file.state === CONST.FILE_POPULATED || file.state === CONST.FILE_PENDING) {
				this.list.splice(key, 1);

				file.load();
			}
		}
	}

	fileProcessComplete (file) {
		if (file.state === CONST.FILE_COMPLETE) {
			// Handle cache
		}

		if (this.list.length === 0) {
			this.loadComplete();
		}
	}

	loadComplete () {
		this.emit('loadcomplete', this);

		this.list.length = 0;
		this.state = CONST.LOADER_COMPLETE;

		this.emit('complete');
	}

	tilemapTiledJSON (key, path) {
		this.addFile(new TilemapJSONFile(this, key, path));
	}

	destroy () {

	}
}

export default LoaderPlugin;

import fs from 'fs';

import CONST from './const';
import GetFastValue from './../utils/object/GetFastValue';

class File {
	constructor(loader, fileConfig) {
		this.loader = loader;

		this.type = GetFastValue(fileConfig, 'type', false);

		this.key = GetFastValue(fileConfig, 'key', false);

		var loadKey = this.key;

		if (!this.type || !this.key) {
			throw new Error('Error calling \'loader. ' + this.type + '\' invalid key provided.');
		}

		this.path = GetFastValue(fileConfig, 'path');

		this.state = CONST.FILE_PENDING;

		this.bytesTotal = 0;

		this.bytesLoaded = -1;

		this.percentComplete = -1;

		this.data = undefined;

		this.config = GetFastValue(fileConfig, 'config', {});
	}

	load () {
		fs.readFile(this.path, 'utf8', (err, data) => {
			if (err) console.log(err);
			this.state = CONST.FILE_COMPLETE;
			this.data = data;
			this.loader.fileProcessComplete(this);
		});
	}

	destroy () {

	}
}

export default File;

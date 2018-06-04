import JSONFile from './JSONFile';

class TilemapJSONFile extends JSONFile {
	constructor(loader, key, path) {
		super(loader, key, path);
		this.type = 'tilemapJSON';
	}
}

export default TilemapJSONFile;

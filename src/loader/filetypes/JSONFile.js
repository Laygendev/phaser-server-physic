import File from './../File';

class JSONFile extends File {
	constructor(loader, key, path) {
		super(loader, {
			type: 'JSON',
			path: path,
			key: key
		});
	}
}

export default JSONFile;

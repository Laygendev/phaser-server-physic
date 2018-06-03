function GetValue(source, key, defaultValue) {
	if (!source || typeof source === 'number') {
		return defaultValue;
	} else if(source.hasOwnProperty(key)) {
		return source[key];
	} else if (key.indexOf('.')) {
		var keys = key .split('.');
		var parent = source;
		var value = defaultValue;

		for(var i = 0; i < keys.length; i++) {
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

export default GetValue;

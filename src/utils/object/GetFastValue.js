function GetFastValue(source, key, defaultValue) {
	var t = typeof(source);

	if (!source || t === 'number' || t === 'string') {
		return defaultValue;
	} else if (source.hasOwnProperty(key) && source[key] !== undefined) {
		return source[key];
	} else {
		return defaultValue;
	}
}

export default GetFastValue;

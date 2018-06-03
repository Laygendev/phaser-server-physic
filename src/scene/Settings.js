import CONST from './const';
import GetValue from './../utils/object/GetValue'

var Settings = {
	create: function (config) {
		if (typeof config === 'string') {
			config = { key: config };
		} else if (config === undefined) {
			config = {};
		}

		return {
			status: CONST.PENDING,

			key: GetValue(config, 'key', ''),
			active: GetValue(config, 'active', false),

			isBooted: false,

			isTransition: false,
			transitionForm: null,
			transitionDuration: 0,

			data: {},

			pack: GetValue(config, 'pack', false),

			loader: GetValue(config, 'loader', {})

		};
	}
};

export default Settings;

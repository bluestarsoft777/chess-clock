const key = 'CHESS_SETTINGS';

export const defaultSettings = {
	// color1: '#3498db',
	// color2: '#d35400',
	timePerPlayerInMins: 10
};

export function save(userSettings) {
	const settings = Object.assign({}, defaultSettings, userSettings);
	const settingsStringified = JSON.stringify(settings);
	localStorage.setItem(key, settingsStringified);
}

export function get() {
	const settingsStringified = localStorage.getItem(key);
	const persistedSettings = JSON.parse(settingsStringified);
	try {
		return Object.assign({}, defaultSettings, persistedSettings);
	}
	catch (error) {

		/* ignore the error */
		return Object.assign({}, defaultSettings);
	}
}

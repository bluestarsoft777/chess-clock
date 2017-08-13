export function minToMs(minutes) {
	return minutes * 60 * 1000;
}

export function format(timeInMs) {
	const timeInSeconds = Math.floor(timeInMs / 1000);
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = timeInSeconds % 60;
	const minutesString = ('0' + minutes).slice(-2);
	const secondsString = ('0' + seconds).slice(-2);
	return `${minutesString}:${secondsString}`;
}

export function calculateTimeLeft({ lastSubstractedTime, timeLeftInMs }) {
	const timeLeft = timeLeftInMs - (new Date() - lastSubstractedTime);
	return timeLeft;
}

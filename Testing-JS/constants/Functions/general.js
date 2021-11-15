function caps(words) {
	let separateWord = words.toLowerCase().split(' ');
	for (let i = 0; i < separateWord.length; i++) {
		separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
	}
	return separateWord.join(' ');
}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

module.exports = { caps, sleep };

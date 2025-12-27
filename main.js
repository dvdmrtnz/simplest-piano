import './3party/tone.min.js';

document.addEventListener('DOMContentLoaded', init);

function init() {

	// Add service worker for offline playing
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('service-worker.js')
			.then(registration => {
				console.log("Service Worker registered");
			}).catch(err => {
				console.log('Service Worker registration failed: ', err);
			})
	}

	const notes = ['Bb3_As3', 'B3',
		'C4', 'Cs4_Db4', 'D4', 'Ds4_Eb4', 'E4', 'F4', 'Fs4_Gb4', 'G4', 'Gs4_Ab4', 'A4', 'As4_Bb4', 'B4',
		'C5', 'Cs5_Db5', 'D5', 'Ds5_Eb5', 'E5', 'F5', 'Fs5_Gb5', 'G5', 'Gs5_Ab5', 'A5', 'As5_Bb5', 'B5',
		'C6', 'Cs6_Db6'];

	for (var i in notes) {
		const note = notes[i]

		let labelDOM = document.createElement('div');
		labelDOM.className = 'label';
		labelDOM.textContent = idToName(note);

		let noteDOM = document.createElement('div');
		noteDOM.className = idToType(note) + '-key';
		noteDOM.id = note;
		noteDOM.appendChild(labelDOM);

		document.querySelector('div.piano').appendChild(noteDOM);
	}

	document.querySelector(".piano").addEventListener("mousedown", start);

	document.addEventListener('touchstart', handleTouchStart);
	document.addEventListener('touchmove', handleTouchStart);
	document.addEventListener('touchend', handleTouchEnd);
	document.addEventListener('touchcancel', handleTouchEnd);

	document.addEventListener('mousedown', handleMouseDown);
	document.addEventListener('mousemove', handleMouseDown);
	document.addEventListener('mouseup', handleMouseUp);
	document.addEventListener('mouseout', handleMouseUp);

}


const midi = new Tone.Sampler({
	urls: {
		"A0": "021.mp3",
		"A#0": "022.mp3",
		"B0": "023.mp3",

		"C1": "024.mp3",
		"C#1": "025.mp3",
		"D1": "026.mp3",
		"D#1": "027.mp3",
		"E1": "028.mp3",
		"F1": "029.mp3",
		"F#1": "030.mp3",
		"G1": "031.mp3",
		"G#1": "032.mp3",
		"A1": "033.mp3",
		"A#1": "034.mp3",
		"B1": "035.mp3",

		"C2": "036.mp3",
		"C#2": "037.mp3",
		"D2": "038.mp3",
		"D#2": "039.mp3",
		"E2": "040.mp3",
		"F2": "041.mp3",
		"F#2": "042.mp3",
		"G2": "043.mp3",
		"G#2": "044.mp3",
		"A2": "045.mp3",
		"A#2": "046.mp3",
		"B2": "047.mp3",

		"C3": "048.mp3",
		"C#3": "049.mp3",
		"D3": "050.mp3",
		"D#3": "051.mp3",
		"E3": "052.mp3",
		"F3": "053.mp3",
		"F#3": "054.mp3",
		"G3": "055.mp3",
		"G#3": "056.mp3",
		"A3": "057.mp3",
		"A#3": "058.mp3",
		"B3": "059.mp3",

		"C4": "060.mp3",
		"C#4": "061.mp3",
		"D4": "062.mp3",
		"D#4": "063.mp3",
		"E4": "064.mp3",
		"F4": "065.mp3",
		"F#4": "066.mp3",
		"G4": "067.mp3",
		"G#4": "068.mp3",
		"A4": "069.mp3",
		"A#4": "070.mp3",
		"B4": "071.mp3",

		"C5": "072.mp3",
		"C#5": "073.mp3",
		"D5": "074.mp3",
		"D#5": "075.mp3",
		"E5": "076.mp3",
		"F5": "077.mp3",
		"F#5": "078.mp3",
		"G5": "079.mp3",
		"G#5": "080.mp3",
		"A5": "081.mp3",
		"A#5": "082.mp3",
		"B5": "083.mp3",

		"C6": "084.mp3",
		"C#6": "085.mp3",
		"D6": "086.mp3",
		"D#6": "087.mp3",
		"E6": "088.mp3",
		"F6": "089.mp3",
		"F#6": "090.mp3",
		"G6": "091.mp3",
		"G#6": "092.mp3",
		"A6": "093.mp3",
		"A#6": "094.mp3",
		"B6": "095.mp3",

		"C7": "096.mp3",
		"C#7": "097.mp3",
		"D7": "098.mp3",
		"D#7": "099.mp3",
		"E7": "100.mp3",
		"F7": "101.mp3",
		"F#7": "102.mp3",
		"G7": "103.mp3",
		"G#7": "104.mp3",
		"A7": "105.mp3",
		"A#7": "106.mp3",
		"B7": "107.mp3",

		"C8": "108.mp3",
	},
	attack: 0.16,
	release: 1,
	volume: -8,
	baseUrl: "./sounds/"
}).toDestination();


const synth = new Tone.PolySynth(Tone.FMSynth).toDestination();

function getKeyFromPoint(x, y) {
	var touchedElement = document.elementFromPoint(x, y);
	if (touchedElement.id) {
		return touchedElement.id;
	} else {
		return touchedElement.parentElement.id;
	}
}

/** Dictionary of keys currently touched, indexed by touch identifier. **/
var currentKeys = {};

function moveTouchToKey(touchIdentifier, key) {
	if (currentKeys[touchIdentifier] !== key) {
		if (currentKeys[touchIdentifier]) {
			console.log('Touch ' + touchIdentifier + ' moved out of ' + currentKeys[touchIdentifier]);
			keyUp(currentKeys[touchIdentifier]);
		};
		if (key) {
			console.log('Touch ' + touchIdentifier + ' moved in to ' + key);
			keyDown(key);
		}
		currentKeys[touchIdentifier] = key;
	}
}

function handleTouchStart(event) {
	if (Tone.getContext().state === "interrupted" || Tone.getContext().state === "suspended") {
		Tone.getContext().resume();
	}

	event.preventDefault();
	var touches = event.touches;
	for (var i = 0; i < touches.length; i++) {
		var touch = touches[i];
		var newKey = getKeyFromPoint(touch.clientX, touch.clientY);
		moveTouchToKey(touch.identifier, newKey);
	}
}

function handleTouchEnd(event) {
	if (Tone.getContext().state === "interrupted" || Tone.getContext().state === "suspended") {
		Tone.getContext().resume();
	}

	event.preventDefault();
	var touches = event.changedTouches;
	for (var i = 0; i < touches.length; i++) {
		var touch = touches[i];
		moveTouchToKey(touch.identifier, null);
	}
}

function handleMouseDown(event) {
	if (Tone.getContext().state === "interrupted" || Tone.getContext().state === "suspended") {
		Tone.getContext().resume();
	}

	event.preventDefault();
	if (event.buttons !== 1) {
		return;
	}
	var newKey = getKeyFromPoint(event.clientX, event.clientY);
	moveTouchToKey(0, newKey);
}

function handleMouseUp(event) {
	if (Tone.getContext().state === "interrupted" || Tone.getContext().state === "suspended") {
		Tone.getContext().resume();
	}

	event.preventDefault();
	moveTouchToKey(0, null);
}

function start() {
	console.log('Tone start');
	Tone.start();
}

function idToName(id) {
	const name = id
		.replaceAll('D', 'Re')
		.replaceAll('C', 'Do')
		.replaceAll('E', 'Mi')
		.replaceAll('F', 'Fa')
		.replaceAll('G', 'Sol')
		.replaceAll('A', 'La')
		.replaceAll('B', 'Si')
		.replaceAll('s', '♯')
		.replaceAll('b', '♭')
		.replaceAll('_', ' ');
	return name;
}

function idToTone(id) {
	const tone = id
		.replaceAll('s', '#')
		.replaceAll('/_[A-za-z0-9]*');
	return tone;
}

function idToType(id) {
	const type = id.includes('s') ? 'black' : 'white';
	return type;
}

function keyDown(id) {
	console.log('Key ' + id + ' down');
	document.querySelector('div#' + id).classList.add('active');
	midi.triggerAttack(idToTone(id), Tone.now());
}

function keyUp(id) {
	console.log('Key ' + id + ' up');
	document.querySelector('div#' + id).classList.remove('active');
	midi.triggerRelease(idToTone(id), Tone.now());
}

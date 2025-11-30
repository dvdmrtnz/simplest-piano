


const synth = new Tone.Synth().toDestination();

function start() {
	console.log('Tone start');
	Tone.start();
}

function play() {
	console.log('Play C4')
	synth.triggerAttackRelease("C4", "8n", Tone.now());
}


document.addEventListener('DOMContentLoaded', init);

function init() {

	(function () {
		var old = console.log;
		var logger = document.getElementById('log');
		console.log = function (message) {
			if (typeof message == 'object') {
				logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
			} else {
				logger.innerHTML += message + '<br />';
			}
		}
	})();

}
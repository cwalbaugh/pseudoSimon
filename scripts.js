
let isOn = false;
let isHumanTurn = true;
let roundCount = document.querySelector('#count');
let moves = [];
let humanMoves = [];
let isStarted = false;
let text = document.querySelector('#start > text');
let isStrict = false;

let strictToggle = document.querySelector('#strict + span')
strictToggle.addEventListener('click', strictSwitch);

function strictSwitch () {
	isStrict = !isStrict;
}

let onButton = document.querySelector('#on');
onButton.addEventListener('click', onOff)

function onOff () {
	isOn = !isOn;
	if (isOn) {
		onButton.innerHTML = 'Turn Off';
		roundCount.innerHTML = '0';
		arrowKeysScroll(false);

	} else {
		text.innerHTML = 'Start';
		//This is a bad way to recenter text
		text.setAttribute('x', '50');
		onButton.innerHTML = 'Turn On';
		roundCount.innerHTML = '_';
		arrowKeysScroll(true);
	}
}

//event listeners and functions for highlighting bar and playing sounds
let bars = document.querySelectorAll('[class = "bar"]');
bars.forEach(function (bar) {
	bar.addEventListener("click", function(event) {
		let selectedBar = event.target.id;
		if (isHumanTurn && isOn &&isStarted) {
			playBar(selectedBar);
			humanMoves.push(selectedBar);
			makeResponse(humanMoves, moves);
		}
	})
})

//turn on and off page scrolling with arrow keys
//arrowKeysScroll(true) means the page can be scroll with the keys
function arrowKeysScroll(x) {
	console.log("arrowKeysScroll", x);
	if (!x) {
		window.addEventListener("keydown", arrowScrollStop, true);
	} else {
		window.removeEventListener("keydown", arrowScrollStop, true);
		console.log('else hit');
	}
}
function arrowScrollStop (e) {
	// space and arrow keys
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
}



document.addEventListener('keyup', function(e) {

	let pushed;

	if (e.which === 38) {
		pushed = 'top';
	}else if (e.which === 37) {
		pushed = 'left';
	}else if (e.which === 40) {
		pushed = 'bottom';
	}else if (e.which === 39) {
		pushed = 'right';
	}
	if (isHumanTurn && isOn && isStarted) {
		playBar(pushed);
		humanMoves.push(pushed);
		makeResponse(humanMoves, moves);
	}
}, false);

function highlight(selectedBar) {
	let bar = document.getElementById(selectedBar);
	bar.setAttribute("style", "filter: url(#highlight)");
	window.setTimeout(function () {
		bar.setAttribute("style", "filter: ");
	},300);
}


let sounds = { 
	'top': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
	'right': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
	'bottom': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
	'left': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
}
function makeNoise(selectedBar) {
	for (sound in sounds) {
		if (sound === selectedBar) {
			sounds[sound].play();
		}
	}
	}
function playBar (selectedBar) {
	if (isOn) {
		highlight(selectedBar);
		makeNoise(selectedBar);
	}
}
//functions for game play =======================
//array of moves selcted for round

//selects, plays, and stores a random bar
function selectRandom () {
	let random =  Math.floor(Math.random() * Math.floor(4));
	
	let barKeys = {
		0: 'top',
		1: 'right',
		2: 'bottom',
		3: 'left'
	}
	let pushed = barKeys[random];
	moves.push(pushed);
	console.log("pushed is: ", pushed);
}

function newRound () {
	selectRandom();
	playMoves();
}



function playMoves () {
	isHumanTurn = false;

	let count = 0;
	let length = moves.length;

	(function next () {
		if (count === length) {
			isHumanTurn = true;
			return;
		}
		
		playBar(moves[count])
		count++;

		setTimeout( function () {
			next();
		}, 700)
	})();
	roundCount.innerHTML = length;
}

//game control flow functions ===================
let startButton = document.querySelector('#start');
startButton.addEventListener('click', start);

function start () {
	if (isOn) {
		isStarted = !isStarted;
		console.log('isStarted is: ', isStarted);
		buttonContent = isStarted ? 'Restart' : 'Start'

		text.innerHTML = buttonContent;

		//This is a bad way to re-center the text in the rect
		text.setAttribute('x', '47');

		if (isStarted) {
			setTimeout (function () {
				newRound();
			}, 1000);
		} else {
			restart();
		} 


	}
}

function restart () {
	moves = [];
	humanMoves = [];
	roundCount.innerHTML = 0;
	start();
}

//check if the two input arrays match
//If guess is shorter than truth, do nothing.
//If guess is same length and same pattern, newRound.
//if guess is same length and different patter, wrongAnswer.
function makeResponse(guess, truth) {

	if (checker(guess, truth) && moves.length === 20) {
		winAnswer();
	}
	else if (checker(guess, truth)) {
		setTimeout ( function () {
			humanMoves = [];
			newRound();
		}, 1000 )
	} else if (guess.length === truth.length && !checker(guess, truth)) {
		console.log('wrong pattern');
		wrongAnswer();
	} 
}

function checker (guess, truth) {
	isMatch = false;
	if (JSON.stringify(guess) === JSON.stringify(truth)) {
		isMatch = true;
	}
	return isMatch;
}

function wrongAnswer () {
	if (isStrict) {
		roundCount.innerHTML = '!!'
		setTimeout (function () {
			restart();
		}, 400);
	} else {
		roundCount.innerHTML = '!!'
		humanMoves = [];
		moves.forEach(function (move) {
			setTimeout (function () {
				playMoves();
			}, 1000);
		})
	}
}

function winAnswer () {

	console.log('win answer run')
	function countDown(count) {
		if (count === 0 ) {
			roundCount.innerHTML = ':D';
			return
		}

		roundCount.innerHTML = count;

		setTimeout(function () {
			countDown(count - 1);
		}, 100)


	}
	countDown(20);
}

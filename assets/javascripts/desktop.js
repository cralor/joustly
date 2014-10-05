var socket = io.connect('/');


function createGame() {
	var roomId = $('#room').val();
	if (roomId == '') {
		console.log('enter a room #!!');
		return;
	}
	socket.emit('createGame', {id: roomId});
	$('#room').remove();
	$('#button')[0].onclick = function gameStart() {
		socket.emit('gameStart', roomId);
	};
	$('#button')[0].innerHTML = 'Start Game';
}

socket.on('gameStart', cueMusic);
socket.on('toggleGameState', dropDaBootyBass);

function dropDaBootyBass(speed) {
	console.log(speed)
	if (speed === 1){
		$("#slow")[0].pause();
		return $("#fast")[0].play();
	}
		$("#fast")[0].pause();
		return $("#slow")[0].play();
}

function cueMusic(roomId){
	console.log(roomId);
	dropDaBootyBass(1);
	$("#button").remove();
}

var socket = io.connect('/');
var isMaster;
var roomId;
var username;
var isLiving = true;
window.addEventListener('shake', death, false);
window.threshold = {};
window.threshold.number = 15;

function joinGame() {
  var hotLoad = {
    roomId: document.getElementById('room').value,
    name: document.getElementById('username').value
  }

  username = hotLoad.name;
  roomId = hotLoad.roomId;
  socket.emit('newJoin', hotLoad);
}

function DOManipsMaster() {
  isMaster = true;
  var but = document.getElementById('butt');
  but.innerText = "START";

  but.onclick = function() {
    document.getElementById('username').setAttribute('type', 'hidden');
    document.getElementById('room').setAttribute('type', 'hidden');
    document.getElementById('butt').remove();
    socket.emit('gamestart', roomId);
  }
}

function DOManipsLave() {
  document.getElementById('room').setAttribute('type', 'hidden');
  document.getElementById('butt').remove();
}

socket.on('test', function() {
  alert('test');
});

socket.on('gameStart', function() {
  document.getElementById('username').setAttribute('type', 'hidden');
  document.getElementById('room').setAttribute('type', 'hidden');
  document.getElementById('butt').remove();
});

socket.on('roomStatus', function(msg) {
  if (msg == 1) {
    DOManipsMaster();
  } else if (msg == 2) {
    DOManipsLave();
  }
});

socket.on('winnerWinnerChickenDinner', function(winner){
  var color;
  if (name === winner) {
    color = 'green';
  } else {
    color = 'red';
  }
  setInterval (function() {
    document.body.style.backgroundColor = color;
    setTimeout(function() {
      document.body.style.backgroundColor = "cyan"
    }, 20)
    setTimeout(function() {
      document.body.style.backgroundColor = color;
    }, 40)
    setTimeout(function() {
      document.body.style.backgroundColor = "cyan"
    }, 60)
  }, 80)
  document.getElementById('h1').innerText = winner + ' WON1!!!!'
});


function death() {
  if (isLiving) {
    var cornshot = {
      username: username,
      roomId: roomId
    };

    console.log(cornshot)
    socket.emit('death', cornshot);
    isLiving = false;
  }
}


var prev_accel,
    prev_x = 0,
    prev_y = 0,
    prev_z = 0,
    fastThresh = 4,// threshold to be changed on
    slowThresh = 2,
    thresh = fastThresh;

// game starts at fast
socket.on('toggleGameState', function (i) {
  if (i === 1) return window.threshold.number = 15
    window.threshold.number = 7
});

console.log(thresh);

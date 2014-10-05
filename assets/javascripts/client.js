var socket = io.connect('/');
var isMaster;
var roomId;
var username;
var isLiving = true;

function joinGame() {
  var hotLoad = {
    roomId: document.getElementById('room').value,
    name: document.getElementById('username').value
  }

  username = hotLoad.name;
  roomId = hotLoad.roomId;
  socket.emit('newJoin', hotLoad)
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
  document.getElementById('fast').play();
});

socket.on('gamestart', function() {
  document.getElementById('username').setAttribute('type', 'hidden');
  document.getElementById('room').setAttribute('type', 'hidden');
  document.getElementById('fast').play();
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
  var slowPlayer = document.getElementById('slow');
  var fastPlayer = document.getElementById('fast');

  // slow
  if (i === -1) {
    thresh = slowThresh;
    fastPlayer.pause();
    slowPlayer.play();
    // normal
  } else if (i === 1) {
    slowPlayer.pause();
    fastPlayer.play();
    thresh = fastThresh;
  }
});

console.log(thresh);

window.ondevicemotion = function (e) {
  var accel = e.accelerationIncludingGravity;
  if (Math.abs(accel.x - prev_x) > thresh && Math.abs(accel.y - prev_y) > thresh ||
      Math.abs(accel.x - prev_x) > thresh && Math.abs(accel.z - prev_y) > thresh ||
      Math.abs(accel.y - prev_y) > thresh && Math.abs(accel.z - prev_z) > thresh){
        death();
      }

  prev_x = accel.x;
  prev_y = accel.y;
  prev_z = accel.z;
}


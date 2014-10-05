var prev_accel,
    prev_x = 0,
    prev_y = 0,
    prev_z = 0,
    fastThresh = 4,// threshold to be changed on 
    slowThresh = 2, 
    thresh = fastThresh; 
    var player = document.getElementById('fast');
    player.play();
    var socket = io.connect("/");

socket.on('toggleGameState', function (i){    
  if (i === -1){ 
      thresh = slowThresh;
      player = document.getElementById('slow');
      player.play();
  }else if (i === 1) {
    thresh = fastThresh; 
  } 
});

console.log(thresh); 

window.ondevicemotion = function (e) {
var accel = e.accelerationIncludingGravity;
  if (Math.abs(accel.x - prev_x) > thresh && Math.abs(accel.y - prev_y) > thresh || 
      Math.abs(accel.x - prev_x) > thresh && Math.abs(accel.z - prev_y) > thresh ||
      Math.abs(accel.y - prev_y) > thresh && Math.abs(accel.z - prev_z) > thresh){ 
      document.body.innerHTML = "prev_x"  + prev_x; 
      socket.emit("death", playerID);
  }

  prev_x = accel.x;
  prev_y = accel.y; 
  prev_z = accel.z; 
}


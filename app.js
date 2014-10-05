var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var devices = require('express-device');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static('assets'));
app.use(express.bodyParser());
app.use(devices.capture());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
  if (req.device.type === "desktop") {
    console.log("yo");
    return res.sendfile( __dirname + '/views/desktop.html');
  }
  res.sendfile( __dirname + '/views/mobile.html');
});

app.get('/a', function (req, res) {
  res.sendfile( __dirname + '/views/audio.html')
});


server.listen(app.get('port'), function(e) {
  console.log('Express server listening on port ' + app.get('port'));
});

function popCheck(roomId) {
  var pop = io.clients(roomId).length;
  if (pop == 2) {
    console.log("returning a 1");
    return 1;
  } else {
    console.log("new player joining room " + roomId);
    return 0;
  }
}

function findVictor(room){
  if (room.deathCount == room.count - 1) {
    console.log(Object.keys(room.players));
    var winner;
    Object.keys(room.players).forEach(function(name) {
      if(room.players[name].living) return winner = name;
    })
  }
  console.log(winner)
  return winner;
}
/*
 * casts to clients
 */
function Player(name) {
  this.living = true;
  this.name = name;
}

function Game(obj) {
  var room = obj.room;
  var socket = obj.socket;
  var state = 1;
  this.count = 0;
  this.deathCount = 0;
  this.players = new Object();

  var randomInterval = 4000;

  //I think this will work
  // state: (fast or slow)
  function loop() {
    randomInterval = (Math.floor((Math.random() * 7) + 1) + 3) * 1000;
    setTimeout(loop, randomInterval);

    console.log("time to song switch: " + randomInterval);

    state *= -1;
    socket.emit('toggleGameState', state);
    io.to(room).emit('toggleGameState', state);
  }

  this.start = function() {
    setTimeout(loop, randomInterval);
  }

}

var activeRooms = new Object();

io.on('connection', function(socket) {
  var roomNumber;
  var timer;

  socket.on('createGame', function (gameInfo) {
    if (activeRooms[gameInfo.id]) {
      return socket.emit('roomStatus', 1);
    }
    activeRooms[gameInfo.id] = new Game({room: gameInfo.id, socket: socket});
    socket.join(gameInfo.id);
    socket.emit('roomStatus', 0);
  })


  socket.on('newJoin', function (hotlad) {
    roomId = hotlad.roomId;
    console.log('hotlad:', hotlad);
    name = hotlad.name;
    socket.join(roomId);
    activeRooms[roomId].count++;
    activeRooms[roomId].players[name] = new Player(name);
    return socket.emit('joinStatus', 0);
  });

  socket.on('gameStart', function(roomId) {
    console.log(roomId);
    socket.emit('gameStart');
    io.to(roomId).emit('gameStart');
    activeRooms[roomId].start();
  });

  socket.on('death', function(payload) {
    var doge;
    var room;
    if (room = activeRooms[payload.roomId]) {
      room.deathCount++;
      room.players[payload.username].living = false;
      doge = findVictor(room);
      if (doge) {
        console.log('winner:', doge);
        io.to(payload.roomId).emit('endGame', doge);
        socket.emit('endGame', doge);
        delete activeRooms[payload.roomId];
      }
    }
  });

  socket.on('test', function() {
    socket.emit('test');
  });
});

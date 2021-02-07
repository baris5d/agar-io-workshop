var all = [];
var food = [];
var players = [];

function Player(id, x, y, size, r, g, b) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.size = size;
  this.r = r;
  this.g = g;
  this.b = b;
}
for (var i = 0; i < 150; i++) {
  food[i] = new Player(
    "food",
    Math.random() * 1000,
    Math.random() * 1000,
    5,
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255
  );
}

var express = require("express");
var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  console.log("Socket app listening");
}

app.use(express.static("public"));

var io = require("socket.io")(server);

setInterval(heartbeat, 5);

function heartbeat() {
  for (var i = players.length - 1; i >= 0; i--) {
    for (var j = food.length - 1; j >= 0; j--) {
      var distance = Math.sqrt(
        (players[i].x - food[j].x) ** 2 + (players[i].y - food[j].y) ** 2
      );
      if (
        distance <
        players[i].size + food[j].size - (players[i].size + food[j].size) / 10
      ) {
        var playerThatAte = players[i];
        playerThatAte.size = Math.sqrt(
          playerThatAte.size ** 2 + food[j].size ** 2
        );

        food.splice(
          j,
          1,
          new Player(
            "food",
            Math.random() * 1000,
            Math.random() * 1000,
            5,
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
          )
        );
      }
    }
  }

  for (var i = players.length - 1; i >= 0; i--) {
    for (var j = i - 1; j >= 0; j--) {
      var distance = Math.sqrt(
        (players[i].x - players[j].x) ** 2 + (players[i].y - players[j].y) ** 2
      );

      if (
        distance <
        players[i].size +
          players[j].size -
          (players[i].size + players[j].size) / 10
      ) {
        if (players[i].size < players[j].size) {
          var playerThatAte = players[j];
          playerThatAte.size = Math.sqrt(
            playerThatAte.size ** 2 + players[i].size ** 2
          );
          var deadId = players[i].id;
          var respawn = new Player(
            deadId,
            Math.random() * 1000,
            Math.random() * 1000,
            50,
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
          );
          players.splice(i, 1);
          players[i] = respawn;
        } else if (players[i].size > players[j].size) {
          var playerThatAte = players[i];
          playerThatAte.size = Math.sqrt(
            playerThatAte.size ** 2 + players[j].size ** 2
          );
          var deadId = players[j].id;
          var respawn = new Player(
            deadId,
            players[i].x + 500,
            players[i].y + 500,
            20,
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
          );
          players.splice(j, 1);
          players[j] = respawn;
        }
      }
    }
  }
  io.sockets.emit("tick", food.concat(players));
}

io.sockets.on("connection", function (socket) {
  socket.on("start", function (data) {
    var blob = new Player(
      socket.id,
      data.x,
      data.y,
      data.size,
      data.r,
      data.g,
      data.b
    );
    players.push(blob);
  });
  socket.on("update", function (data) {
    for (var i = 0; i < players.length; i++) {
      if (socket.id === players[i].id) {
        players[i].x = data.x;
        players[i].y = data.y;
      }
    }
  });

  socket.on("disconnect", function () {
    players.splice(
      players.findIndex(function (o) {
        return o.id === socket.id;
      }),
      1
    );
  });
});

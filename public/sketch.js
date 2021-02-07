var socket;

var newPlayer;

var players = [];
var oldView = 1;
function setup() {
  createCanvas(2000, 1000);

  socket = io.connect("http://localhost:3333");

  newPlayer = new Player(
    100,
    100,
    50,
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255
  );

  var data = {
    x: newPlayer.pos.x,
    y: newPlayer.pos.y,
    size: newPlayer.size,
    r: newPlayer.r,
    g: newPlayer.g,
    b: newPlayer.b,
  };
  socket.emit("start", data);

  socket.on("tick", function (kap) {
    players = kap;
  });
}

function draw() {
  background(255, 192, 203);

  var view = 100 / newPlayer.size;
  translate(width / 2, height / 2);

  scale(view);
  translate(-newPlayer.pos.x, -newPlayer.pos.y);

  fill(100, 100, 100);
  rect(
    newPlayer.pos.x + 4 * newPlayer.size,
    newPlayer.pos.y - 3.7 * newPlayer.size,
    4 * newPlayer.size,
    3 * newPlayer.size
  );

  for (var i = players.length - 1; i >= 0; i--) {
    if (players[i].id === socket.id) {
      newPlayer.pos.x = players[i].x;
      newPlayer.pos.y = players[i].y;
      newPlayer.size = players[i].size;
      newPlayer.r = players[i].r;
      newPlayer.g = players[i].g;
      newPlayer.b = players[i].b;

      newPlayer.update();

      newPlayer.bounds();
      var data = {
        x: newPlayer.pos.x,
        y: newPlayer.pos.y,
        size: newPlayer.size,
        r: newPlayer.r,
        g: newPlayer.g,
        b: newPlayer.b,
      };
      socket.emit("update", data);
    }

    fill(players[i].r, players[i].g, players[i].b);

    ellipse(
      players[i].x,
      players[i].y,
      players[i].size * 2,
      players[i].size * 2
    );

    fill(0);
    textAlign(CENTER);
    textSize(4 + players[i].size / 5);
    if (players[i].id !== "food") {
      text(
        players[i].id.substring(0, 5) +
          "\n" +
          "score : " +
          Math.round(players[i].size),
        players[i].x,
        players[i].y
      );
      fill(players[i].r, players[i].g, players[i].b);
      var xOfMap = newPlayer.pos.x + 4 * newPlayer.size;
      var yOfMap = newPlayer.pos.y - 3.7 * newPlayer.size;
      ellipse(
        xOfMap + (players[i].x / 1000) * 4 * newPlayer.size,
        yOfMap + (players[i].y / 1000) * 3 * newPlayer.size,
        (players[i].size / 150) * newPlayer.size,
        (players[i].size / 150) * newPlayer.size
      );
    }
  }
}

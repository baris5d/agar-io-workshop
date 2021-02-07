function Player(x, y, size, r, g, b) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.size = size;
  this.r = r;
  this.g = g;
  this.b = b;
  this.update = function () {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.setMag(5);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  };
  this.bounds = function () {
    if (this.pos.x < -0) {
      this.pos.x = 0;
    }
    if (this.pos.y < -0) {
      this.pos.y = 0;
    }
    if (this.pos.x > 1000) {
      this.pos.x = 1000;
    }
    if (this.pos.y > 1000) {
      this.pos.y = 1000;
    }
  };
  this.draw = function () {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
  };
}

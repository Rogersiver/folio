export default function sketch(p) {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  class Rectangle {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }

    contains(point) {
      return (
        point.x >= this.x &&
        point.x <= this.x + this.w &&
        point.y >= this.y &&
        point.y <= this.y + this.h
      );
    }
  }

  class Quadtree {
    constructor(boundary, capacity, level = 0) {
      this.boundary = boundary;
      this.capacity = capacity;
      this.points = [];
      this.divided = false;
      this.level = level;
    }

    subdivide() {
      let x = this.boundary.x;
      let y = this.boundary.y;
      let w = this.boundary.w;
      let h = this.boundary.h;

      let nw = new Rectangle(x, y, w / 2, h / 2);
      let ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
      let sw = new Rectangle(x, y + h / 2, w / 2, h / 2);
      let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);

      this.northwest = new Quadtree(nw, this.capacity, this.level + 1);
      this.northeast = new Quadtree(ne, this.capacity, this.level + 1);
      this.southwest = new Quadtree(sw, this.capacity, this.level + 1);
      this.southeast = new Quadtree(se, this.capacity, this.level + 1);

      this.divided = true;
    }

    insert(point) {
      if (!this.boundary.contains(point)) {
        return false;
      }

      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      } else {
        if (!this.divided) {
          this.subdivide();
        }

        return (
          this.northeast.insert(point) ||
          this.northwest.insert(point) ||
          this.southeast.insert(point) ||
          this.southwest.insert(point)
        );
      }
    }

    show() {
      let char = this.points.length > this.capacity / 2 ? "S" : "R";
      let col =
        this.points.length > this.capacity / 2
          ? p.color(255, 255, 0)
          : p.color(255);

      // Draw background
      p.fill(0);
      p.noStroke();
      p.rect(
        this.boundary.x,
        this.boundary.y,
        this.boundary.w,
        this.boundary.h,
      );

      // Draw boundary
      p.stroke(255);
      p.noFill();
      p.rect(
        this.boundary.x,
        this.boundary.y,
        this.boundary.w,
        this.boundary.h,
      );

      // Draw character
      p.fill(col);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(this.boundary.w * 0.6);
      p.text(
        char,
        this.boundary.x + this.boundary.w / 2,
        this.boundary.y + this.boundary.h / 2,
      );

      if (this.divided) {
        this.northeast.show();
        this.northwest.show();
        this.southeast.show();
        this.southwest.show();
      }
    }
  }

  let qt;
  let totalPoints = 0;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
    resetQuadtree();
    p.frameRate(60);
  };

  function resetQuadtree() {
    let boundary = new Rectangle(0, 0, p.width, p.height);
    qt = new Quadtree(boundary, 4);
    totalPoints = 0;
  }

  p.draw = function() {
    p.background(0);
    for (let i = 0; i < 10; i++) {
      let point = new Point(p.random(p.width), p.random(p.height));
      qt.insert(point);
      totalPoints++;
    }

    if (totalPoints > 10000) {
      resetQuadtree();
    }

    qt.show();
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    resetQuadtree();
  };
}

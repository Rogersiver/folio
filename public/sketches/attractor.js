export default function sketch(p) {
  let particles;
  let attractorR; // Attractor for 'R'
  let attractorS; // Attractor for 'S'
  let numParticles = 400;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(18); // Set text size for visibility
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height), i % 2 === 0 ? 'R' : 'S'));
    }
    attractorR = new Attractor(p.width * 0.3, p.height / 2);
    attractorS = new Attractor(p.width * 0.7, p.height / 2);
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    attractorR.setPosition(p.width * 0.3, p.height / 2);
    attractorS.setPosition(p.width * 0.7, p.height / 2);
  };

  p.draw = function() {
    p.background(0);
    attractorR.update();
    attractorS.update();
    particles.forEach(particle => {
      if (particle.char === 'R') {
        particle.attracted(attractorR.position);
      } else {
        particle.attracted(attractorS.position);
      }
      particle.update();
      particle.display();
    });
  };

  class Particle {
    constructor(x, y, char) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(0, 0);
      this.acc = p.createVector(0, 0);
      this.maxSpeed = 4;
      this.char = char;
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    display() {
      p.fill(this.char === 'R' ? 255 : 255, 255,  this.char === 'R' ? 0 : 255); // White for 'R', Yellow for 'S'
      p.text(this.char, this.pos.x, this.pos.y);
    }

    attracted(target) {
      let force = p.createVector(target.x - this.pos.x, target.y - this.pos.y);
      let distance = force.mag();
      distance = p.constrain(distance, 0, 200);
      let strength = 10 / distance;
      force.setMag(strength);
      this.acc.add(force);
    }
  }

  class Attractor {
    constructor(x, y) {
      this.position = p.createVector(x, y);
    }

    update() {
      this.position.x += p.random(-20, 20);
      this.position.y += p.random(-20, 20);
    }

    setPosition(x, y) {
      this.position.x = x;
      this.position.y = y;
    }
  }
}


import Matter from "matter-js";

export default function sketch(p) {
  let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    engine,
    world,
    letters = [],
    boundaries = [];

  const dampingFactor = 0.99; // Damping factor for motion
  let letterCount = 100; // Initial number of letters

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(64);
    p.textAlign(p.CENTER, p.CENTER);
    p.colorMode(p.HSB, 255);

    // Initialize physics engine
    engine = Engine.create();
    world = engine.world;

    // Create initial letters
    createLetters(letterCount);

    // Create boundaries
    createBoundaries();

    // Set up collision detection
    Matter.Events.on(engine, "collisionStart", handleCollisions);
  };

  function createLetters(count) {
    let word = "RSRSRSRS";
    for (let i = 0; i < count; i++) {
      let x = p.random(p.width);
      let y = p.random(-p.height, 0);
      let letter = word[p.floor(p.random(word.length))];
      let ttl = p.random(300, 600); // TTL in frames (5 to 10 seconds)
      let body = Bodies.rectangle(x, y, 50, 50, {
        restitution: 0.5,
        friction: 0.01,
      });
      body.label = letter;
      body.ttl = ttl;
      body.initialTtl = ttl;
      letters.push(body);
      World.add(world, body);
    }
  }

  function createBoundaries() {
    // Remove existing boundaries
    boundaries.forEach((boundary) => World.remove(world, boundary));
    boundaries = [];

    // Create new boundaries
    let thickness = 50;
    boundaries.push(
      Bodies.rectangle(
        p.width / 2,
        p.height + thickness / 2,
        p.width,
        thickness,
        {
          isStatic: true,
        },
      ),
    ); // Bottom

    boundaries.forEach((boundary) => World.add(world, boundary));
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    createBoundaries(); // Always update boundaries
  };

  p.draw = function() {
    p.background(0);

    Engine.update(engine);

    // Apply damping to the letters
    letters.forEach((letter) => {
      Body.setVelocity(letter, {
        x: letter.velocity.x * dampingFactor,
        y: letter.velocity.y * dampingFactor,
      });
    });

    // Display letters and update TTL
    for (let i = letters.length - 1; i >= 0; i--) {
      let letter = letters[i];
      let pos = letter.position;

      // Reduce TTL
      letter.ttl--;

      // Fade out effect
      let alpha = p.map(letter.ttl, 0, letter.initialTtl, 0, 255);
      p.fill(255, alpha);

      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(letter.angle);
      p.text(letter.label, 0, 0);
      p.pop();

      // Remove letters that have reached their TTL
      if (letter.ttl <= 0) {
        World.remove(world, letter);
        letters.splice(i, 1);
      }
    }

    // Add new letters to keep the rain effect continuous
    if (letters.length < letterCount) {
      createLetters(letterCount - letters.length);
    }
  };

  function handleCollisions(event) {
    let pairs = event.pairs;
    pairs.forEach((pair) => {
      let { bodyA, bodyB } = pair;

      if (
        (letters.includes(bodyA) && boundaries.includes(bodyB)) ||
        (letters.includes(bodyB) && boundaries.includes(bodyA))
      ) {
        // Letters hit the bottom boundary, apply bounce effect
        let letter = letters.includes(bodyA) ? bodyA : bodyB;
        let velocityY = -Math.abs(letter.velocity.y * 0.5);
        Body.setVelocity(letter, { x: letter.velocity.x, y: velocityY });
      }
    });
  }

  p.mousePressed = function() {
    // Add more letters when the canvas is clicked
    createLetters(10);
  };

  p.remove = function() {
    Matter.World.clear(world);
    Matter.Engine.clear(engine);
  };
}

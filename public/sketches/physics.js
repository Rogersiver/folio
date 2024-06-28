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

  let previousPosition = { x: window.screenX, y: window.screenY };
  let previousSize = { width: window.innerWidth, height: window.innerHeight };
  let previousTime = Date.now();
  const dampingFactor = 0.999; // Damping factor for motion

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(64);
    p.textAlign(p.CENTER, p.CENTER);
    p.colorMode(p.HSB, 255);

    // Initialize physics engine
    engine = Engine.create();
    world = engine.world;

    // Create letter bodies
    let word = "RSRS";
    let xOffset = 2; // Offset for each stack
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < word.length; i++) {
        let x = p.width / 2 + i * 70 - 100 + j * xOffset;
        let y = p.height / 2 + j * 100 - 100;
        let body = Bodies.rectangle(x, y, 50, 50, {
          restitution: 0.9,
          friction: 0.01,
        });
        body.label = word[i];
        letters.push(body);
        World.add(world, body);
      }
    }

    // Create boundaries
    createBoundaries();

    // Start checking for window movement
    checkWindowMovement();

    // Set up collision detection
    Matter.Events.on(engine, "collisionStart", handleCollisions);
  };

  function createBoundaries() {
    // Remove existing boundaries
    boundaries.forEach((boundary) => World.remove(world, boundary));
    boundaries = [];

    // Create new boundaries
    let thickness = 50;
    boundaries.push(
      Bodies.rectangle(p.width / 2, -thickness / 2, p.width, thickness, {
        isStatic: true,
      }),
    ); // Top
    boundaries.push(
      Bodies.rectangle(
        p.width / 2,
        p.height + thickness / 2,
        p.width,
        thickness,
        { isStatic: true },
      ),
    ); // Bottom
    boundaries.push(
      Bodies.rectangle(-thickness / 2, p.height / 2, thickness, p.height, {
        isStatic: true,
      }),
    ); // Left
    boundaries.push(
      Bodies.rectangle(
        p.width + thickness / 2,
        p.height / 2,
        thickness,
        p.height,
        { isStatic: true },
      ),
    ); // Right

    boundaries.forEach((boundary) => World.add(world, boundary));
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);

    // Calculate resizing velocity
    let currentSize = { width: window.innerWidth, height: window.innerHeight };
    let deltaTime = (Date.now() - previousTime) / 1000; // in seconds

    let velocityX = (currentSize.width - previousSize.width) / deltaTime;
    let velocityY = (currentSize.height - previousSize.height) / deltaTime;

    if (deltaTime > 0 && (velocityX < 0 || velocityY < 0)) {
      applyBoundaryCollisionForces(velocityX, velocityY);
    }

    createBoundaries(); // Always update boundaries

    previousSize = currentSize;
    previousTime = Date.now();
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

    // Display letters
    p.fill(255);
    letters.forEach((letter) => {
      let pos = letter.position;
      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(letter.angle);
      p.text(letter.label, 0, 0);
      p.pop();

      // Ensure letters stay within the canvas
      if (letter.position.x < 0) {
        Body.setPosition(letter, { x: 25, y: letter.position.y });
      } else if (letter.position.x > p.width) {
        Body.setPosition(letter, { x: p.width - 25, y: letter.position.y });
      }

      if (letter.position.y < 0) {
        Body.setPosition(letter, { x: letter.position.x, y: 25 });
      } else if (letter.position.y > p.height) {
        Body.setPosition(letter, { x: letter.position.x, y: p.height - 25 });
      }
    });
  };

  function checkWindowMovement() {
    let currentPosition = { x: window.screenX, y: window.screenY };
    let currentTime = Date.now();
    let deltaTime = (currentTime - previousTime) / 1000; // in seconds

    if (
      currentPosition.x !== previousPosition.x ||
      currentPosition.y !== previousPosition.y
    ) {
      let deltaX = currentPosition.x - previousPosition.x;
      let deltaY = currentPosition.y - previousPosition.y;

      let velocityX = deltaX / deltaTime;
      let velocityY = deltaY / deltaTime;

      applyBoundaryCollisionForces(velocityX, velocityY);

      previousPosition = currentPosition;
      previousTime = currentTime;
    }

    requestAnimationFrame(checkWindowMovement);
  }

  function applyBoundaryCollisionForces(velocityX = 0, velocityY = 0) {
    letters.forEach((letter) => {
      boundaries.forEach((boundary) => {
        let collision = Matter.SAT.collides(letter, boundary);
        if (collision && collision.collided) {
          let forceMagnitudeX = 0.0001 * velocityX * letter.mass;
          let forceMagnitudeY = 0.0001 * velocityY * letter.mass;

          // Apply proportional forces only if window size is decreasing
          if (velocityX < 0) {
            forceMagnitudeX *= 0.5;
          }

          if (velocityY < 0) {
            forceMagnitudeY *= 0.5;
          }

          // Apply an upward force if colliding with the bottom boundary
          if (boundary === boundaries[1]) {
            forceMagnitudeY = -Math.abs(forceMagnitudeY);
          }

          Body.applyForce(letter, letter.position, {
            x: forceMagnitudeX,
            y: forceMagnitudeY,
          });
        }
      });
    });
  }

  function handleCollisions(event) {
    let pairs = event.pairs;
    pairs.forEach((pair) => {
      let { bodyA, bodyB } = pair;

      if (letters.includes(bodyA) && boundaries.includes(bodyB)) {
        let velocityX = (previousPosition.x - window.screenX) / 100;
        let velocityY = (previousPosition.y - window.screenY) / 100;
        applyCollisionForces(bodyA, velocityX, velocityY, bodyB);
      } else if (letters.includes(bodyB) && boundaries.includes(bodyA)) {
        let velocityX = (previousPosition.x - window.screenX) / 100;
        let velocityY = (previousPosition.y - window.screenY) / 100;
        applyCollisionForces(bodyB, velocityX, velocityY, bodyA);
      }
    });
  }

  function applyCollisionForces(letter, velocityX, velocityY, boundary) {
    let forceMagnitudeX = 0.0001 * velocityX * letter.mass;
    let forceMagnitudeY = 0.0001 * velocityY * letter.mass;

    // Apply an upward force if colliding with the bottom boundary
    if (boundary === boundaries[1]) {
      forceMagnitudeY = -Math.abs(forceMagnitudeY);
    }

    Body.applyForce(letter, letter.position, {
      x: forceMagnitudeX,
      y: forceMagnitudeY,
    });
  }

  p.remove = function() {
    cancelAnimationFrame(checkWindowMovement);
  };
}

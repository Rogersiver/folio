export default function sketch(p) {
  let bird;
  let pipes = [];
  let gameState = "playing"; // Can be 'playing' or 'gameOver'
  const gravity = 0.6;
  const lift = -15;
  const pipeWidth = 20;
  const pipeGap = 200;
  let score = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    resetGame();
  };

  function resetGame() {
    bird = new Bird();
    pipes = [];
    score = 0;
    gameState = "playing";
    pipes.push(new Pipe());
  }

  p.draw = () => {
    p.background(0);

    if (gameState === "playing") {
      bird.update();
      bird.show();

      if (p.frameCount % 75 === 0) {
        pipes.push(new Pipe());
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();

        if (pipes[i].hits(bird)) {
          gameState = "gameOver";
        }

        if (pipes[i].offscreen()) {
          pipes.splice(i, 1);
          score++;
        }
      }

      showScore();
    } else {
      displayEndGameAnimation();
    }
  };

  function showScore() {
    p.fill(255, 255, 0);
    p.text(`${score}`, 20, 50);
  }

  function displayEndGameAnimation() {
    p.fill(255, 0, 0);
    p.textSize(32);
    p.text("RS", p.width / 2, p.height / 2 - 20);
    p.textSize(16);
    p.text(`Final Score: ${score}`, p.width / 2, p.height / 2 + 20);

    setTimeout(() => {
      resetGame();
    }, 2000);
  }

  class Bird {
    constructor() {
      this.y = p.height / 2;
      this.x = 64;
      this.velocity = 0;
    }

    show() {
      p.fill(255, 255, 0);
      p.text("R", this.x, this.y);
    }

    update() {
      this.velocity += gravity;
      this.velocity *= 0.9; // Air resistance
      this.y += this.velocity;

      if (this.y > p.height) {
        this.y = p.height;
        this.velocity = 0;
      }

      if (this.y < 0) {
        this.y = 0;
        this.velocity = 0;
      }

      this.think();
    }

    think() {
      if (pipes.length > 0) {
        let closestPipe = pipes[0];
        for (let pipe of pipes) {
          if (pipe.x + pipe.w > this.x) {
            closestPipe = pipe;
            break;
          }
        }

        let targetY = closestPipe.top + pipeGap / 2;

        if (this.y > targetY + 10) {
          this.up();
        } else if (this.y < targetY - 10) {
          this.velocity += gravity; // Let gravity pull down if above the target
        }
      }
    }

    up() {
      this.velocity += lift;
    }
  }

  class Pipe {
    constructor() {
      this.top = p.random(p.height / 6, (3 / 4) * p.height);
      this.bottom = p.height - (this.top + pipeGap);
      this.x = p.width;
      this.w = pipeWidth;
      this.speed = 6;
    }

    show() {
      p.fill(255);
      for (let i = 0; i < this.top / 32; i++) {
        p.text("S", this.x, i * 32);
      }
      for (let i = 0; i < this.bottom / 32; i++) {
        p.text("S", this.x, p.height - i * 32);
      }
    }

    update() {
      this.x -= this.speed;
    }

    offscreen() {
      return this.x < -this.w;
    }

    hits(bird) {
      if (bird.y < this.top || bird.y > p.height - this.bottom) {
        if (bird.x > this.x && bird.x < this.x + this.w) {
          return true;
        }
      }
      return false;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.textSize(16);
  };
}

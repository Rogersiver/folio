export default function sketch(p) {
  const cols = 50;
  const rows = 30;
  const grid = new Array(cols);
  const openSet = [];
  const closedSet = [];
  let start, goal;
  let w, h;
  let path = [];
  let current;
  let resetTimer = -1;

  const asciiChars = {
    wall: "x",
    open: " ",
    openSet: "R",
    closedSet: "S",
    path: "█",
    goal: "RS",
  };

  function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (p.random(1) < 0.3) {
      this.wall = true;
    }

    this.show = function(char, col) {
      p.fill(col);
      p.noStroke();
      p.text(char, this.i * w + w / 2, this.j * h + h / 2);
    };

    this.addNeighbors = function(grid) {
      let i = this.i;
      let j = this.j;
      if (i < cols - 1) {
        this.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.neighbors.push(grid[i - 1][j]);
      }
      if (j < rows - 1) {
        this.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0) {
        this.neighbors.push(grid[i][j - 1]);
      }
    };
  }

  function reset() {
    for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = new Cell(i, j);
      }
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }

    // Choose a random start point
    const startCorner = p.random(grid.flat());
    start = startCorner;
    start.wall = false;

    // Ensure the goal is not too close to the start
    let found = false;
    while (!found) {
      const goalX = p.floor(p.random(cols - 1));
      const goalY = p.floor(p.random(rows - 1));
      goal = [
        grid[goalX][goalY],
        grid[goalX + 1][goalY],
        grid[goalX][goalY + 1],
        grid[goalX + 1][goalY + 1],
      ];
      if (p.dist(start.i, start.j, goal[0].i, goal[0].j) > 10) {
        found = true;
      }
    }

    goal.forEach((cell) => (cell.wall = false));

    openSet.length = 0;
    closedSet.length = 0;
    openSet.push(start);
    resetTimer = -1;
  }

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);

    w = p.width / cols;
    h = p.height / rows;

    reset();
  };

  p.draw = function() {
    if (resetTimer > 0 && p.millis() - resetTimer > 1000) {
      reset();
    }

    if (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].g < openSet[winner].g) {
          winner = i;
        }
      }

      current = openSet[winner];

      if (goal.includes(current)) {
        if (resetTimer === -1) {
          resetTimer = p.millis();
        }
        return;
      }

      openSet.splice(winner, 1);
      closedSet.push(current);

      let neighbors = current.neighbors;
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          let tempG = current.g + 1;

          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          if (newPath) {
            neighbor.previous = current;
          }
        }
      }
    } else {
      if (resetTimer === -1) {
        resetTimer = p.millis();
      }
      return;
    }

    p.background(0, 20); // Add a fading effect to the background

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let cell = grid[i][j];
        if (
          !openSet.includes(cell) &&
          !closedSet.includes(cell) &&
          !cell.wall
        ) {
          cell.show(asciiChars.open, 255);
        } else if (cell.wall) {
          cell.show(asciiChars.wall, 255);
        }
      }
    }

    for (let i = 0; i < closedSet.length; i++) {
      closedSet[i].show(asciiChars.closedSet, p.color(255, 255, 0, 50)); // White with transparency
    }

    for (let i = 0; i < openSet.length; i++) {
      openSet[i].show(asciiChars.openSet, p.color(0, 255, 0, 255)); // Green with transparency
    }

    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }

    for (let i = 0; i < path.length; i++) {
      path[i].show(asciiChars.path, p.color(255, 255, 255, 255)); // Yellow
    }

    // Show the goal with a distinct character and color
    goal.forEach((cell) => cell.show(asciiChars.goal, p.color(0, 255, 0, 255))); // Yellow
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    w = p.width / cols;
    h = p.height / rows;
    reset();
  };
}

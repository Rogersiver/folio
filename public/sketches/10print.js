export default function sketch(p) {
  let cols, rows;
  let x = 0,
    y = 0;
  let resolution = 40; // Size of each cell in the grid
  let grid;
  let startCorner = 0; // Variable to determine the starting corner
  let resetting = false;
  let lastResetTime = 0; // Time when the last reset was triggered
  let waitTime = 2000; // Wait time of 2 seconds

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    initGrid();
    p.frameRate(30);
    p.textSize(resolution);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255, 255, 0); // White color for the characters
  };

  function initGrid() {
    cols = Math.floor(p.width / resolution);
    rows = Math.floor(p.height / resolution);
    grid = new Array(cols).fill().map(() => new Array(rows).fill(""));
    p.background(0); // Clear the background when reinitializing
    setStartingPosition();
  }

  p.windowResized = function() {
    initGrid();
  };

  function setStartingPosition() {
    switch (startCorner) {
      case 0:
        x = 0;
        y = 0;
        break;
      case 1:
        x = cols - 1;
        y = 0;
        break;
      case 2:
        x = cols - 1;
        y = rows - 1;
        break;
      case 3:
        x = 0;
        y = rows - 1;
        break;
    }
    resetting = false;
  }

  function checkComplete() {
    if ((startCorner === 0 || startCorner === 3) && x === 0 && y >= rows) {
      return true;
    } else if (
      (startCorner === 1 || startCorner === 2) &&
      x === cols - 1 &&
      y >= rows
    ) {
      return true;
    }
    return false;
  }

  p.draw = function() {
    if (!resetting) {
      if (grid[x][y] === "") {
        grid[x][y] = p.random(["⟋", "╲"]);
      }
      p.text(
        grid[x][y],
        x * resolution + resolution / 2,
        y * resolution + resolution / 2,
      );

      if (startCorner === 0 || startCorner === 3) {
        x++;
        if (x >= cols) {
          x = 0;
          y++;
        }
      } else {
        x--;
        if (x < 0) {
          x = cols - 1;
          y++;
        }
      }

      if (checkComplete()) {
        lastResetTime = p.millis();
        resetting = true;
      }
    } else {
      if (p.millis() - lastResetTime > waitTime) {
        startCorner = (startCorner + 1) % 4; // Change the starting corner
        initGrid(); // Clear the grid and reinitialize
      }
    }
  };
}

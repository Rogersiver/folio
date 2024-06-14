export default function sketch(p) {
  let cols, rows;
  let x = 0,
    y = 0;
  let resolution = 60; // Initial size of each cell in the grid
  let grid;
  let startCorner = 0; // Variable to determine the starting corner
  let resetting = false;
  let lastResetTime = 0; // Time when the last reset was triggered
  let waitTime = 2000; // Wait time of 2 seconds
  let currentColor = [255, 255, 0]; // Start with yellow color

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    initGrid();
    p.frameRate();
    p.textSize(resolution);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(currentColor);
  };

  function initGrid() {
    resolution = p.random([40, 50, 60, 70, 80]); // Randomize the resolution
    cols = Math.floor(p.width / resolution);
    rows = Math.floor(p.height / resolution);
    grid = new Array(cols).fill().map(() => new Array(rows).fill(""));
    p.background(0); // Clear the background when reinitializing
    setStartingPosition();
    p.textSize(resolution);
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
    if (
      (startCorner === 0 && y >= rows) ||
      (startCorner === 1 && y >= rows) ||
      (startCorner === 2 && y < 0) ||
      (startCorner === 3 && y < 0)
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

      if (startCorner === 0) {
        x++;
        if (x >= cols) {
          x = 0;
          y++;
        }
      } else if (startCorner === 1) {
        x--;
        if (x < 0) {
          x = cols - 1;
          y++;
        }
      } else if (startCorner === 2) {
        x--;
        if (x < 0) {
          x = cols - 1;
          y--;
        }
      } else if (startCorner === 3) {
        x++;
        if (x >= cols) {
          x = 0;
          y--;
        }
      }

      if (checkComplete()) {
        lastResetTime = p.millis();
        resetting = true;
      }
    } else {
      if (p.millis() - lastResetTime > waitTime) {
        startCorner = (startCorner + 1) % 4; // Change the starting corner
        currentColor =
          currentColor[0] === 255 ? [255, 255, 255] : [255, 255, 0]; // Alternate between yellow and white
        p.fill(currentColor);
        initGrid(); // Clear the grid and reinitialize
      }
    }
  };
}

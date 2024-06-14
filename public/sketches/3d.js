export default function sketch(p) {
  let cols, rows;
  let scl = 20;
  let w, h;
  let flying = 0;
  const asciiChars = ["R", "S"];
  let font;

  p.preload = function() {
    // Load the font from the public folder
    font = p.loadFont("/Arial.otf");
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.textFont(font);
    cols = p.floor(p.width / scl);
    rows = p.floor(p.height / scl);
    w = p.width;
    h = p.height;
    p.textSize(scl);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();
  };

  p.draw = function() {
    p.background(0);
    flying -= 0.01;

    p.translate(2, 2, 100);
    p.rotateX(p.PI / 16);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let xOff = x * 0.1;
        let yOff = y * 0.1 + flying;
        let z = p.noise(xOff, yOff) * 100 - 50; // Adjust noise scaling

        // Calculate the distance from the current grid point to the mouse
        let gridX = x * scl - w / 2;
        let gridY = y * scl - h / 2;
        let mouseXInWorld = p.mouseX - p.width / 2;
        let mouseYInWorld = p.mouseY - p.height / 2;
        let d = p.dist(gridX, gridY, mouseXInWorld, mouseYInWorld);

        // Adjust the noise and color based on the distance to the mouse
        if (d < 150) {
          // Within 100 pixels from the mouse
          z += p.map(d, 0, 100, 50, 0); // Increase z-value closer to the mouse
        }

        let char = asciiChars[p.int(p.noise(xOff, yOff) * asciiChars.length)];
        let col = char === "R" ? p.color(255) : p.color(255, 255, 0);

        if (d < 100) {
          col = p.color(0, 255, 0); // Change color to green if close to the mouse
        }

        p.push();
        p.translate(gridX, gridY, z);
        p.fill(col);
        p.text(char, 0, 0);
        p.pop();
      }
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    cols = p.floor(p.width / scl);
    rows = p.floor(p.height / scl);
  };
}

export default function sketch(p) {
  let asciiChars =
    'RSRSRSRSRSRSRSRSrsrsrsrsrsrsrsrs/|()1{}[]?-_+~<>i!lI;:,"^`.';
  let initialSize;
  let maxLevel = 5; // Reduced maximum recursion level for performance

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(30); // Reduced frame rate for better performance
    initialSize = p.width / 4; // Dynamically set the initial size based on canvas width
    p.textSize(18 * (p.width / 1920)); // Scale text size based on canvas width
    p.colorMode(p.HSB, 255);
  };

  p.draw = function() {
    p.background(0);
    for (let x = 0; x < p.width; x += initialSize) {
      for (let y = 0; y < p.height; y += initialSize) {
        drawSymmetricFractal(
          x + initialSize / 2,
          y + initialSize / 2,
          initialSize,
          maxLevel,
        );
      }
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    initialSize = p.width / 4; // Re-calculate initial size based on new canvas width
    p.textSize(18 * (p.width / 1920)); // Adjust text size based on new canvas width
  };

  function drawSymmetricFractal(x, y, size, level) {
    if (level === 0) return;

    let displacement = p.cos(y * 0.02 + p.frameCount * 0.02) * 10;
    y += displacement;

    let distance = p.dist(x, y, p.width / 2, p.height / 2);
    let gray = p.map(distance % 360, 0, 360, 50, 200);

    p.fill(30, 0, 255 - gray * 0.8);
    let charIndex = p.int(p.map(gray, 50, 200, 0, asciiChars.length - 1));

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.text(asciiChars[charIndex], x, y);

    if (level > 1) {
      let newSize = size / 2;
      drawSymmetricFractal(x + newSize, y, newSize, level - 1);
      drawSymmetricFractal(x - newSize, y, newSize, level - 1);
      drawSymmetricFractal(x, y + newSize, newSize, level - 1);
      drawSymmetricFractal(x, y - newSize, newSize, level - 1);
    }
  }
}

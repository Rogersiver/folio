export default function sketch(p) {
  let asciiChars =
    'RSRSRSRSRSRSRSRSrsrsrsrsrsrsrsrs/|()1{}[]?-_+~<>i!lI;:,"^`.';
  let fixedWidth = 1920;
  let fixedHeight = 1080;
  let initialSize = fixedWidth / 2;

  p.setup = function() {
    p.createCanvas(fixedWidth, fixedHeight);
    p.frameRate(60);
    p.textSize(12);
    p.colorMode(p.HSB, 255);
  };

  p.draw = function() {
    p.background(0);
    let maxLevel = 6;

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

    for (let x = -initialSize / 2; x < p.width; x += initialSize) {
      for (let y = -initialSize / 2; y < p.height; y += initialSize) {
        drawSymmetricFractal(
          x + initialSize / 2,
          y + initialSize / 2,
          initialSize,
          maxLevel,
        );
      }
    }
  };

  function drawSymmetricFractal(x, y, size, level) {
    if (level === 0) return;

    let displacement = p.cos(y * 0.02 + p.frameCount * 0.02) * 10;
    y += displacement;

    let angle = p.sin(1);
    let distance = p.dist(x, y, p.width / 2, p.height / 2);
    let wave = 0.01 * p.frameCount;

    let phase = p.cos(2) * distance + angle;
    let offset = p.cos(wave + phase);
    let gray = p.map(offset, -1, 1, 10, 235);

    p.fill(30, gray, 255 - gray * 0.8);

    let charIndex = p.int(p.map(gray, 2, 255, 0, asciiChars.length - 1));

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.text(asciiChars[charIndex], x, y);

    let newSize = size / 2;
    if (level > 1) {
      drawSymmetricFractal(x + newSize / 1.2, y, newSize, level - 1);
      drawSymmetricFractal(x - newSize / 2, y, newSize, level - 1);
      drawSymmetricFractal(x, y + newSize / 1.2, newSize, level - 1);
      drawSymmetricFractal(x, y - newSize / 1.2, newSize, level - 1);
    }
  }
}

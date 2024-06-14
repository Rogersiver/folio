// public/sketches/sketch1.js
export default function sketch(p) {
  let asciiChars = "RSSS▆▅▄▃▂▁▁▂▃▄▅▆▆▆▆▆";

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
    p.textSize(24);
    p.colorMode(p.HSB, 255);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(0);
    let waveHeight = p.height / (p.windowHeight / 30);
    let waveLength = p.width / (p.windowWidth / 20);

    for (let x = 0; x < p.width; x += waveLength) {
      for (let y = 0; y < p.height; y += waveHeight) {
        let noiseFactor = p.noise(x * 0.001, y * 0.001, p.frameCount * 0.001);
        let phase = p.frameCount * 0.01 + x * 0.02 + 50 * noiseFactor;
        let wave = p.sin(phase);
        let smoothWave = (wave + 1) / 2;
        let gray = p.map(smoothWave, 0, 1, 0, 240);
        p.fill(30, gray, 255);
        let charIndex = p.int(p.map(gray, 0, 255, 0, asciiChars.length - 1));
        p.text(asciiChars[charIndex], x + waveLength / 2, y + waveHeight / 2);
      }
    }
  };
}

export default function sketch(p) {
    let sigma1 = 15, rho1 = 27, beta1 = 9.0 / 3.0;
    let sigma2 = 10, rho2 = 32, beta2 = 4.0 / 3.0;

    // Initial conditions for left visualization
    let x1 = 0.004, y1 = 0, z1 = 0;

    // Initial conditions for right visualization
    let x2 = 0.002, y2 = 0, z2 = 0;

    let dt = 0.002;

    let points1 = [];
    let points2 = [];

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
        p.frameRate(60);  // Increase the frame rate for faster animation
    };

    p.draw = function() {
        p.background(0); // Hard reset the background

        let cols = p.width / (2 * 16);  // Divide by 2 for two visualizations, 16 for text size
        let rows = p.height / 16;

        for (let i = 0; i < 10; i++) {  // Increase the number of samples per frame
            // Update for the left visualization
            let dx1 = sigma1 * (y1 - x1) * dt;
            let dy1 = (x1 * (rho1 - z1) - y1) * dt;
            let dz1 = (x1 * y1 - beta1 * z1) * dt;

            x1 += dx1;
            y1 += dy1;
            z1 += dz1;

            let px1 = p.map(x1, -20, 20, 0, cols);
            let py1 = p.map(y1, -30, 30, 0, rows);

            let char1 = 'R';

            points1.push({ char: char1, px: px1, py: py1, opacity: 255 });

            let dx2 = sigma2 * (y2 - x2) * dt;
            let dy2 = (x2 * (rho2 - z2) - y2) * dt;
            let dz2 = (x2 * y2 - beta2 * z2) * dt;

            x2 += dx2;
            y2 += dy2;
            z2 += dz2;

            let px2 = p.map(x2, -20, 20, 0, cols);
            let py2 = p.map(y2, -30, 30, 0, rows);

            let char2 = 'S';

            points2.push({ char: char2, px: px2, py: py2, opacity: 255 });
        }

        // Draw points for the left visualization (trailing points first)
        for (let i = points1.length - 1; i >= 0; i--) {
            let point = points1[i];
            if (i !== points1.length - 1) {
                p.fill(30, 30, 30, point.opacity); // Trail color in red
                p.textSize(32);  // Larger text size for 'R'
                p.text(point.char, point.px * 16 * 2, point.py * 16); // Adjust position scaling based on larger text size
            }
            // Reduce opacity to create a fading effect
            point.opacity -= 1;
            if (point.opacity <= 0) {
                points1.splice(i, 1); // Remove point when it is fully faded
            }
        }

        // Draw points for the right visualization (trailing points first)
        for (let i = points2.length - 1; i >= 0; i--) {
            let point = points2[i];
            if (i !== points2.length - 1) {
                p.fill(20, 20, 0, point.opacity); // Trail color in green
                p.textSize(32);  // Larger text size for 'S'
                p.text(point.char, point.px * 16 * 2, point.py * 16); // Adjust position scaling based on larger text size
            }
            // Reduce opacity to create a fading effect
            point.opacity -= 15;
            if (point.opacity <= 0) {
                points2.splice(i, 1); // Remove point when it is fully faded
            }
        }

        // Draw the main characters last to ensure they are on top
        if (points1.length > 0) {
            let mainPoint1 = points1[points1.length - 1];
            p.fill(255, 255, 255); // Main character in white
            p.textSize(32);  // Larger text size for 'R'
            p.text(mainPoint1.char, mainPoint1.px * 16 * 2, mainPoint1.py * 16); // Adjust position scaling based on larger text size
        }

        if (points2.length > 0) {
            let mainPoint2 = points2[points2.length - 1];
            p.fill(255, 255, 0); // Main character in white
            p.textSize(32);  // Larger text size for 'S'
            p.text(mainPoint2.char, mainPoint2.px * 16 * 2, mainPoint2.py * 16); // Adjust position scaling based on larger text size
        }

        // Limit the number of points to avoid overloading
        if (points1.length > 10000) {
            points1.splice(0, 50); // Remove old points gradually
        }
        if (points2.length > 10000) {
            points2.splice(0, 50); // Remove old points gradually
        }
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}


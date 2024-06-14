export default function sketch(p) {
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Rectangle {
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }

        contains(point) {
            return (point.x >= this.x && point.x <= this.x + this.w &&
                point.y >= this.y && point.y <= this.y + this.h);
        }
    }

    class Quadtree {
        constructor(boundary, capacity, isRoot = true, level = 0) {
            this.boundary = boundary;
            this.capacity = capacity;
            this.points = [];
            this.divided = false;
            this.isRoot = isRoot;
            this.level = level;  // Add level tracking for resetting
        }

        subdivide() {
            let x = this.boundary.x;
            let y = this.boundary.y;
            let w = this.boundary.w;
            let h = this.boundary.h;

            let ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
            let nw = new Rectangle(x, y, w / 2, h / 2);
            let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
            let sw = new Rectangle(x, y + h / 2, w / 2, h / 2);

            // Sub-quadtrees created with incremented level
            this.northeast = new Quadtree(ne, this.capacity, false, this.level + 1);
            this.northwest = new Quadtree(nw, this.capacity, false, this.level + 1);
            this.southeast = new Quadtree(se, this.capacity, false, this.level + 1);
            this.southwest = new Quadtree(sw, this.capacity, false, this.level + 1);

            this.divided = true;
        }

        insert(point) {
            if (!this.boundary.contains(point)) {
                return false;
            }

            if (this.points.length < this.capacity) {
                this.points.push(point);
                return true;
            } else {
                if (!this.divided) {
                    this.subdivide();
                }

                return this.northeast.insert(point) || this.northwest.insert(point) ||
                    this.southeast.insert(point) || this.southwest.insert(point);
            }
        }

        show() {
            if (!this.isRoot && !this.divided) { // Only draw boundaries if not the root and not subdivided
                p.stroke(180);
                p.noFill();
                p.strokeWeight(1);
                p.textSize(p.max(8, this.boundary.w / 4));
                p.textAlign(p.CENTER, p.CENTER);

                let density = p.map(this.points.length, 0, this.capacity, 0, 255);
                let charIndex = p.int(p.map(density, 0, 255, 0, asciiChars.length - 1));

                // Calculate color based on size, blending from white to yellow
                let sizeFactor = p.map(this.boundary.w, 0, p.width, 1, 0);
                let r = p.lerp(255, 255, sizeFactor);
                let g = p.lerp(255, 255, sizeFactor);
                let b = p.lerp(255, 0, sizeFactor);
                p.fill(r, g, b);

                p.text(asciiChars[charIndex], this.boundary.x + this.boundary.w / 2, this.boundary.y + this.boundary.h / 2);
            }
            if (this.divided) {
                this.northeast.show();
                this.northwest.show();
                this.southeast.show();
                this.southwest.show();
            }
        }
    }

    // ASCII characters sorted from less to more dense
    let asciiChars = '  .-RrsRS';
    let qt;
    let totalPoints = 0; // Track the total number of points

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        resetQuadtree();
    };

    function resetQuadtree() {
        let boundary = new Rectangle(0, 0, p.width, p.height);
        qt = new Quadtree(boundary, 4); // Adjust capacity for more detailed divisions
        totalPoints = 0; // Reset the total points counter
        p.frameRate(10);
    }

    p.draw = function() {
        p.background(0); // Hard reset the background
        // Continuously add points
        let maxPoints = 1000; // Adjust this to control when the quadtree resets
        for (let i = 0; i < 5; i++) {
            let point = new Point(p.random(p.width), p.random(p.height));
            qt.insert(point);
            totalPoints++;
        }
        if (totalPoints > maxPoints) {
            resetQuadtree(); // Reset when a certain number of points is exceeded
        }
        qt.show();
    };

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        resetQuadtree(); // Reset Quadtree on window resize
    };
}


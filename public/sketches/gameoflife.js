export default function sketch(p) {
    let cols, rows;
    let grid;
    let nextGrid;
    let resolution = 20;  // Cell size in pixels, adjust as needed for different densities
    let asciiChars = [' ', '.', '*', '+', 'RS'];  // Characters from less dense to more dense

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        cols = p.floor(p.width / resolution);
        rows = p.floor(p.height / resolution);

        grid = make2DArray(cols, rows);
        nextGrid = make2DArray(cols, rows);
        initializeGrid();  // Function to initialize the grid with random values

        p.textSize(resolution);
        p.noStroke();
        p.frameRate(12);  // Reduced frame rate to slow down the animation
    };

    p.draw = function() {
        p.background(0);

        // Display the grid using ASCII characters
        displayGrid();

        // Compute next generation based on grid
        computeNextGeneration();

        // Swap grids
        let temp = grid;
        grid = nextGrid;
        nextGrid = temp;
    };

    function initializeGrid() {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = p.floor(p.random(2));  // Randomly initialize the grid
            }
        }
    }

    function displayGrid() {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let x = i * resolution;
                let y = j * resolution;
                let state = grid[i][j];
                let nextState = nextGrid[i][j];
                let index = state * (asciiChars.length - 1);  // Correct index calculation

                if (state === 1 && nextState === 0) {
                    p.fill(255, 255, 0); // Yellow for cells that are dying
                } else if (state === 1) {
                    p.fill(255); // White for live cells
                } else {
                    p.fill(0); // Black for dead cells
                }

                p.text(asciiChars[index], x, y + resolution - 2);
            }
        }
    }

    function computeNextGeneration() {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                let neighbors = countNeighbors(grid, i, j);

                if (state == 0 && neighbors == 3) {
                    nextGrid[i][j] = 1;
                } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[i][j] = 0;
                } else {
                    nextGrid[i][j] = state;
                }
            }
        }
    }

    function make2DArray(cols, rows) {
        let arr = new Array(cols);
        for (let i = 0; i < cols; i++) {
            arr[i] = new Array(rows);
        }
        return arr;
    }

    function countNeighbors(grid, x, y) {
        let sum = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let col = (x + i + cols) % cols; // Wrap around at the edges
                let row = (y + j + rows) % rows; // Wrap around at the edges
                sum += grid[col][row];
            }
        }
        sum -= grid[x][y];
        return sum;
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        cols = p.floor(p.width / resolution);
        rows = p.floor(p.height / resolution);
        grid = make2DArray(cols, rows);
        nextGrid = make2DArray(cols, rows);
        initializeGrid();
    };
}


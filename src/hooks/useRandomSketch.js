import { useEffect, useState } from "react";

const useRandomSketch = () => {
  const [sketch, setSketch] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sketches = [
        "flappy.js",
        "rain.js",
        "astar.js",
        "djikstra.js",
        "bfs.js",
        "noise.js",
        "noise2.js",
        "quadtree.js",
        "gameoflife.js",
        "lorenz.js",
        "10print.js",
        "attractor.js",
        "physics.js",
        "physrain.js",
      ];
      const randomSketch =
        sketches[Math.floor(Math.random() * sketches.length)];
      import(`../../public/sketches/${randomSketch}`).then((mod) => {
        setSketch(() => mod.default);
      });
    }
  }, []);

  return sketch;
};

export default useRandomSketch;

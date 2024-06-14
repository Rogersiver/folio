import { useEffect, useState } from 'react';

const useRandomSketch = () => {
  const [sketch, setSketch] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sketches = ['astar.js', 'rain.js', 'tendrils.js', 'quadtree.js', 'gameoflife.js', 'lorenz.js']; // Add your sketches here
      const randomSketch = sketches[Math.floor(Math.random() * sketches.length)];
      import(`../../public/sketches/${randomSketch}`).then((mod) => {
        setSketch(() => mod.default);
      });
    }
  }, []);

  return sketch;
};

export default useRandomSketch;


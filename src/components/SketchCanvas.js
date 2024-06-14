// components/SketchCanvas.js
import { useEffect, useRef } from 'react';
import useRandomSketch from '../hooks/useRandomSketch';
import p5 from 'p5';

const SketchCanvas = () => {
  const sketchRef = useRef();
  const sketch = useRandomSketch();

  useEffect(() => {
    let p5Instance;

    if (sketch) {
      p5Instance = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [sketch]);

  return <div ref={sketchRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />;
};

export default SketchCanvas;


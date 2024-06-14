'use client';

import { useEffect, useRef } from 'react';
import useRandomSketch from '../hooks/useRandomSketch';
import useClientSide from '../hooks/useClientSide';
import p5 from 'p5';

const SketchCanvas = () => {
  const sketchRef = useRef();
  const sketch = useRandomSketch();
  const isClient = useClientSide();

  useEffect(() => {
    let p5Instance;

    if (isClient && sketch) {
      p5Instance = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [isClient, sketch]);

  return <div ref={sketchRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />;
};

export default SketchCanvas;


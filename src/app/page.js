'use client';
// pages/index.js
import Head from 'next/head';
import SketchCanvas from '../components/SketchCanvas';

export default function Home() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Head>
        <title>p5.js Background with Next.js</title>
        <meta name="description" content="Roger Siver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SketchCanvas />

      <main style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
        <h1 style={{ width: 100, color: "yellow", background: "black", margin: 'auto'
         }}> - RS - </h1>
      </main>
    </div>
  );
}


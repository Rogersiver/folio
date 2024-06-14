"use client";
// pages/index.js
import dynamic from "next/dynamic";
import Head from "next/head";
//import SketchCanvas from '../components/SketchCanvas';

const SketchCanvas = dynamic(() => import("../components/SketchCanvas.js"), {
  ssr: false,
});

export default function Home() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Head>
        <title>p5.js Background with Next.js</title>
        <meta name="description" content="Roger Siver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SketchCanvas />

      <main style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        <h1
          style={{
            width: "200px",
            color: "white",
            background: "black",
            padding: "20px",
            margin: "auto",
            textAlign: "center",
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          {" "}
          -RS-{" "}
        </h1>
      </main>
    </div>
  );
}

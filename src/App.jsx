
import './App.css';
import { Box, OrbitControls, PerformanceMonitor, PerspectiveCamera, Stats } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import GameController from "./GameController";






export default function App() {
  return (
    <>
    <Canvas>

    {/* <Stats/> */}
    
    <axesHelper scale={[2,2,2]}/>
    
    <hemisphereLight position={[20, 100, 20]} skyColor={0xeeeeff}  // Color of the sky (top hemisphere)
        groundColor={0x777777}  intensity={1}/>

    

    <GameController/>

    <OrbitControls/>

    </Canvas>
      
    </>
  );
}















  




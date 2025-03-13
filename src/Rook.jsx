import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


export default function Rook(){

  const scene_rook = useMemo(()=>useLoader(GLTFLoader, "/assets/rook/scene.gltf"), []); 
  const rook = scene_rook.scene;
  rook.traverse((child) => {
    if (child.isMesh) {
      child.material.flatShading = true; // Apply flat shading to each mesh
      child.material.needsUpdate = true; // Mark material as needing an update
    }
  });

  return(
    <>
      <primitive object={rook} scale={[0.25,0.25,0.25]} position={[0,0.5,0]} />
    </>
  );

}
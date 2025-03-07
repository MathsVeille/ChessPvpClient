import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


export default function Pawn(){

  const scene_pawn = useMemo(()=>useLoader(GLTFLoader, "/assets/pawn/scene.gltf"), []); 
  const pawn = scene_pawn.scene;
  scene_pawn.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.flatShading = true; // Apply flat shading to each mesh
      child.material.needsUpdate = true; // Mark material as needing an update
    }
  });

  return(
    <>
      <primitive object={pawn} scale={[0.25,0.25,0.25]} position={[0,0.5,0]} />
    </>
  );

}
import { Box, Clone, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


export default function Enemy_pawn(){

  const scene_pawn = useMemo(()=>useLoader(GLTFLoader, "/assets/enemy_pawn/scene.gltf"), []); 
  const ennemy_pawn = scene_pawn.scene;
  /*ennemy_pawn.traverse((child) => {
    if (child.isMesh) {
      child.material.flatShading = true; // Apply flat shading to each mesh
      child.material.needsUpdate = true; // Mark material as needing an update
    }
  }); */

  return(
    <group>
      <Clone object={ennemy_pawn} scale={[0.25,0.25,0.25]}/>     
    </group>
  );

}
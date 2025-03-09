import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export default function Chessboard(){
    const cases = new Set();
    const {scene} = useThree();
  
    useEffect(()=>{
      for(let j = 1; j<9; j=j+2){
        for(let i = 1; i<9; i++){
        
          let material;
          if(i%2 === 1){
            material = new MeshStandardMaterial({color:"SaddleBrown"})
          }else{
            material = new MeshStandardMaterial({color:"FloralWhite"})
          }
          material.flatShading = true;
          
          const square = new Mesh(new BoxGeometry(1,1,1), material);
          square.position.set(i,0,j);
          scene.add(square);
    
          cases.add({x:i, z:j});
        }
        
      }
    
      for(let j = 2; j<9; j=j+2){
        for(let i = 1; i<9; i++){
        
          let material;
          if(i%2 === 0){
            material = new MeshStandardMaterial({color:"SaddleBrown"})
          }else{
            material = new MeshStandardMaterial({color:"FloralWhite"})
          }
          
          const square = new Mesh(new BoxGeometry(1,1,1), material);
          square.position.set(i,0,j);
          scene.add(square);
    
          cases.add({x:i, z:j});
        }
        
      }


    },[]);
    
  }
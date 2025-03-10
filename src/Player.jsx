import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import Pawn from './Pawn';
import { update } from 'three/examples/jsm/libs/tween.module.js';

export default function Player({myWantedPos, myWantedPosChanged, position}){

    useEffect(() => {
        console.log("player re render");
      window.addEventListener("keydown", handleInput);
      
      return()=>{

        window.removeEventListener("keydown", handleInput);
        
      }
    }, []);
  

    //variables
    const camera = useRef();
    let x = useRef(0);
    const pion = useRef();
  
    
  
    useFrame((state, d)=>{
        //on evite les valeurs énormes(qui provoquent des bugs après) quand l'onglet est inactif, max 0.2s/5fps
        let delta = Math.min(d, 0.2);
        //camera
        camera.current.lookAt(pion.current.position.x, pion.current.position.y, pion.current.position.z+3);
  
        //player mouvement
        if(x.current>0.01){
            pion.current.position.x +=(delta);
            x.current -= delta; 
        }else if(x.current < -0.01){
            pion.current.position.x -=(delta);
            x.current += delta;
        }else if(x!=0){
            x.current = 0;
            pion.current.position.x = Math.round(pion.current.position.x);
        }
        //send position to server
        //myPos.current = {x:pion.current.position.x, z:pion.current.position.z};
  
    });

  
    const handleInput = (event)=>{
      if(!event.repeat){      
  
        if(event.key === "ArrowUp" && x.current <=1){
          x.current += 1;
          console.log("added to x");
          //send position to server, on veut bouger d'une case donc x:1
          myWantedPos.current = {x:1, z:0};
          myWantedPosChanged();
          
        }
        else if(event.key === "ArrowDown" && x.current >=-1){
          x.current -= 1;
          myWantedPos.current = {x:-1, z:0};
          myWantedPosChanged();
        }
        
      }
    };



  
    return(
      <>
        <group ref={pion} position={[position.x, 0, position.z]}>
         
          <PerspectiveCamera makeDefault={true} position={[0,1,-2]} ref={camera}/>
        
            <Pawn />
  
           <OrbitControls/>
  
        </group>    


      </>
    );
}
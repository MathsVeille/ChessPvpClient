import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import Pawn from './Pawn';
import Rook from './Rook';
import { update } from 'three/examples/jsm/libs/tween.module.js';

export default function PlayerRook({myWantedPos, myWantedPosChanged, position}){

    const [piece, setPiece] = useState(4); //1=>pawn 2=>horse 3=>bishop 4=>rook 5=>Queen 6=>King


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
    let z = useRef(0);
    const pion = useRef();

    //direction vide au debut pour ne pas en avanttager aucune
    let acceleration = useRef({accel:0, dir:""});
  
    
  
    useFrame((state, d)=>{
        //on evite les valeurs énormes(qui provoquent des bugs après) quand l'onglet est inactif, max 0.2s/5fps
        let delta = Math.min(d, 0.2);
        //camera
        camera.current.lookAt(pion.current.position.x, pion.current.position.y, pion.current.position.z);
        

        //console.log(pion.current.position.x);
  
        //player mouvement
        if(x.current>0.05){
            pion.current.position.x +=(delta*acceleration.current.accel);
            x.current -= delta*acceleration.current.accel;
        }else if(x.current < -0.05){
            pion.current.position.x -=(delta*acceleration.current.accel);
            x.current += delta*acceleration.current.accel;
        }else if(x.current!=0){
            //on s'arette donc multipcilateur de vitesse remis à 1
            x.current = 0;
            pion.current.position.x = Math.round(pion.current.position.x);
            acceleration.current.accel = 1; 
        }


        if(z.current>0.05){
          pion.current.position.z +=(delta*acceleration.current.accel);
          z.current -= delta*acceleration.current.accel; 
        }else if(z.current < -0.05){
            pion.current.position.z -=(delta*acceleration.current.accel);
            z.current += delta*acceleration.current.accel;
        }else if(z.current!=0){
            z.current = 0;
            pion.current.position.z = Math.round(pion.current.position.z);
            acceleration.current.accel = 1; 
      }
        //send position to server
        //myPos.current = {x:pion.current.position.x, z:pion.current.position.z};
  
    });


    const handleInput = (event)=>{      
  
        if(event.key === "ArrowUp" && x.current <=1 && z.current == 0 && pion.current.position.x <7 || event.key === "ArrowUp" && x.current == 0 && z.current == 0 && pion.current.position.x == 7){
          if(acceleration.current.dir != "+x"){acceleration.current.accel = 1; acceleration.current.dir = "+x"}
          else{acceleration.current.accel += 0.4}
          x.current += 1;
          myWantedPos.current = {x:1, z:0};
          myWantedPosChanged();
          
        }
        else if(event.key === "ArrowDown" && x.current >=-1 && z.current == 0 && pion.current.position.x > 2|| event.key === "ArrowDown" && x.current == 0 && z.current == 0 && pion.current.position.x == 2){
          if(acceleration.current.dir != "-x"){acceleration.current.accel = 1; acceleration.current.dir = "-x"}
          else{acceleration.current.accel += 0.4}
          x.current -= 1;
          myWantedPos.current = {x:-1, z:0};
          myWantedPosChanged();
        }
        else if(event.key === "ArrowLeft" && z.current >=-1 && x.current == 0 && pion.current.position.z > 2 || event.key === "ArrowLeft" && z.current == 0 && x.current == 0 && pion.current.position.z == 2){
          if(acceleration.current.dir != "-z"){acceleration.current.accel = 1; acceleration.current.dir = "-z"}
          else{acceleration.current.accel += 0.4}
          z.current -= 1;
          myWantedPos.current = {x:0, z:-1};
          myWantedPosChanged();
        }
        else if(event.key === "ArrowRight" && z.current <=1 && x.current == 0 && pion.current.position.z < 7||event.key === "ArrowRight" && z.current ==0 && x.current == 0 && pion.current.position.z == 7){
          if(acceleration.current.dir != "+z"){acceleration.current.accel = 1; acceleration.current.dir = "+z"}
          else{acceleration.current.accel += 0.4}
          z.current += 1;
          myWantedPos.current = {x:0, z:1};
          myWantedPosChanged();
        }
        
    };



  
    return(
      <>
        <group ref={pion} position={[position.x, 0, position.z]}>
         
          <PerspectiveCamera makeDefault={true} position={[0,1,-2]} ref={camera}/>
            {piece == 1 &&(
              <Pawn />
            )}
            {piece == 4 &&(
              <Rook/>
            )}
            
           <OrbitControls/>
  
        </group>    


      </>
    );
}
import { Box, Html, OrbitControls, PerspectiveCamera, PositionalAudio } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Audio, BoxGeometry, Color, Mesh, MeshStandardMaterial, Raycaster, Vector2, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';






export default function Chessboard({setChosen}){
    const cases = useRef(new Map()); //[key:{x:x, z:z}, value{color, obj}]
    const casesBis = useRef([]);
    const casesColores = useRef([]);
    const {scene, camera} = useThree();

    const raycaster = new Raycaster();
    const pointer = useRef(new Vector2());

    const onPointerMove = (event)=>{
      pointer.current.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      pointer.current.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      
    
    }
    const clicked = ()=>{
      console.log(casesColores.current);
      setChosen({x:casesColores.current[0].case.position.x, z:casesColores.current[0].case.position.z});
      document.removeEventListener('mousedown', clicked);
      window.removeEventListener('pointermove', onPointerMove);
      spawnDefini.current = 1;
      casesColores.current[0].case.material.color.set(casesColores.current[0].col);
    }
    
    
    useEffect(()=>{

      

      document.addEventListener('mousedown', clicked);
      document.addEventListener( 'pointermove', onPointerMove );

      camera.position.set(5, 8, 5);
      camera.lookAt(5, 0, 5);


      

      
    

      for(let j = 1; j<9; j=j+2){
        for(let i = 1; i<9; i++){
        
          let material;
          let color;
          if(i%2 === 1){
            color = "SaddleBrown";
          }else{
            color = "FloralWhite";
          }
          material = new MeshStandardMaterial({color:color})
          material.flatShading = true;
          
          const square = new Mesh(new BoxGeometry(1,1,1), material);
          square.position.set(i,0,j);
          scene.add(square);
    
          cases.current.set({x:i, z:j}, {obj:square, color:color});
          casesBis.current.push(square);
        }
        
      }
    
      for(let j = 2; j<9; j=j+2){
        for(let i = 1; i<9; i++){
        
          let material;
          let color;
          if(i%2 === 0){
            color = "SaddleBrown";
          }else{
            color = "FloralWhite";
          }
          material = new MeshStandardMaterial({color:color})
          const square = new Mesh(new BoxGeometry(1,1,1), material);
          square.position.set(i,0,j);
          scene.add(square);
    
          cases.current.set({x:i, z:j}, {obj:square, color:color});
          casesBis.current.push(square);
        }
        
      }


      //on clean derriere
      return()=>{
        document.removeEventListener('pointermove', onPointerMove );
        document.removeEventListener('mousedown', clicked);

        casesBis.current.forEach(square => {
          scene.remove(square)
        });
    
      }
        


    },[]);

const spawnDefini = useRef(0);
      useFrame(()=>{

        //si on a pas encore choisi la case de depart
        if(!spawnDefini.current){
          raycaster.setFromCamera(pointer.current, camera);
          const intersects = raycaster.intersectObjects(casesBis.current, false);



          if(intersects.length>0){
            if(intersects[0].object.material.color.getHex() != 0xff0000){
              //On supprime celles qui étaient colorées
              casesColores.current.forEach(cube => {
                cube.case.material.color.set(cube.col);
              });
              casesColores.current = [];
              //on enregistre la couleur de la case modifé
              const couleur = intersects[0].object.material.color.getHex();
              intersects[0].object.material.color.set(0xff0000);
              casesColores.current.push({col:couleur, case:intersects[0].object}); 
              audioRef.current.play();
            }
          
          }

      }
      

     
        
      
    });
      
  
  const audioRef = useRef();

 

  return(
    <>
    
   
   
        <PositionalAudio ref={audioRef} url="./assets/sound/tum.wav" loop={false}/>
    
    
      
    </>
    
  );   
}
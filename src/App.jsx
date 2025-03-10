
import './App.css';
import { Box, PositionalAudio, Html, OrbitControls, PerformanceMonitor, PerspectiveCamera, Stats } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import GameController from "./GameController";





export default function App() {



  const [Started, start] = useState(false);

  
  const handleUserGesture =async ()=>{
    const background = document.getElementById('background');
    buttonAudioRef.current.play();

    for(let i = 0; i<250; i=i+2){
      
        background.style.backgroundColor = "rgb("+i+","+i+","+i+")";
        await new Promise(resolve =>setTimeout(resolve, 10));
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume()
    start(true);
  }

  const buttonAudioRef = useRef();

  return (
    <>

{!Started && (
  <>
    <div id="background" style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            zIndex: '-1',
            opacity: '1', // Start with full opacity
            transition: 'opacity 1s ease',
            animation: 'fadeToWhite 5s linear infinite'
        }}></div>
        
      

        <button onClick={handleUserGesture} 
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} // Scale up on hover
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} 
                    style={{
                      width: '60%',
                      height: '30%',
                      padding: '15px 30px',
                      backgroundColor: 'white',
                      color: 'black',
                      fontSize: '32px',
                      fontFamily: 'Arial, sans-serif', // Modern, clean font
                      fontWeight: 'bold', // Bold text
                      textTransform: 'uppercase', // Uppercase text for modern look
                      letterSpacing: '2px', // Increased letter spacing
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '20%',
                      left: '20%',
                      right: '20%',
                      zIndex: 1,
                      borderRadius: '4px', // Slight border-radius for a softer modern look without being rounded
                      border: '2px solid #e0e0e0', // Light border color
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transitions
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for depth
                    

      }}>Commencer</button>
  
  </>
         
)}
      



    <Canvas>
      <PositionalAudio ref={buttonAudioRef} url="./assets/sound/button_press.wav" loop={false}/>

    {/* <Stats/> */}
    
    <axesHelper scale={[2,2,2]}/>
    
    <hemisphereLight position={[20, 100, 20]} skyColor={0xeeeeff}  // Color of the sky (top hemisphere)
        groundColor={0x777777}  intensity={1}/>

    

    {Started && (
      <GameController/>
    )}
    </Canvas>
      
    </>
  );
}















  




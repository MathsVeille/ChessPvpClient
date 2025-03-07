import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


import Chessboard from './Chessboard';
import Player from './Player';
import Enemy_pawn from './Enemy_pawn';
import Pawn from './Pawn';


const socket = io("http://localhost:3001/");

export default function GameController(){

        

        const [playersClient, setPlayers] = useState([]);
        let myPos = useRef({x:0, z:0});

        
    
        useEffect(() => {


            //on close tout si fenetre fermée
            window.addEventListener('beforeunload', ()=>{
                socket.off("connect");
                socket.off("player_pos");
                socket.off("new_player");
                socket.close();
            });

            console.log("RENDER");
            
        
            //reseau
            console.log("besfore on connect")
            socket.on("connect", ()=>{
                console.log("connected");
                console.log(socket.id);
            });

            socket.on("player_pos", (id, x, z)=>{
                console.log("on polayer pos "+id, x, z);
                setPlayers(prev => prev.filter(player => player.id !==id));
                setPlayers(prev =>[...prev, {id, x, z}]);
            });
                
            

            socket.on("new_player", (player)=>{
                setPlayers(prev => [...prev, player]);
                console.log("new player");
                console.log(player.id);
            });

            socket.on("player_left", (id)=>{
                setPlayers(prev => prev.filter(player => player.id !== id));
                console.log("player left");
            });

          
        return()=>{
            socket.off("connect");
            socket.off("player_pos");
            socket.off("new_player");
            socket.off("player_left");
            socket.close();
        }
        }, []);

        let i = 1;
        useFrame(()=>{
            i++;
            if(i%60 == 0){
                socket.emit("player_pos", myPos.current.x, myPos.current.z);
            }
            
            //console.log(playersClient);
        })



    return(
        <>
   
            
            <Chessboard/>
            <>
                {
                playersClient.map((plr)=>(
                   
                        <group key={plr.id} position={[plr.x, 0.5, plr.z]}>
                             <Suspense /* key={plr.id} */>
                                <Enemy_pawn /* key={plr.id} *//>
                            </Suspense>
                            
                        </group>
                    
                ))
                }
            </>
            <Suspense key={"1fgfg"}> 
                <Player myPos={myPos}/>
            </Suspense>

        </>
        
    );
}



  
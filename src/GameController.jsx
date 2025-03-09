import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


import Chessboard from './Chessboard';
import Player from './Player';
import Enemy_pawn from './Enemy_pawn';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';


//const socket = io("http://207.154.195.241:3001/");
//const socket = io("http://localhost:3001");

export default function GameController(){

        
        const playersClientDesieredPositions = useRef(new Map()); //[key: id, value: {ref: reference de l'objet 3d, x:change_wanted, z:change_wanted}]
        const [nb_players, setNbPlayers]= useState(1);
        let myWantedPos = useRef({x:0, z:0});

        
        const myWantedPosChanged = ()=>{
            console.log("emmited" + myWantedPos.current.x + myWantedPos.current.z);
            socket.current.emit("desired_player_pos", {x:myWantedPos.current.x, z:myWantedPos.current.z});
            
        };

        const {scene} = useThree();
        
        const ennemy_pawn = useMemo(()=>(useLoader(GLTFLoader, "/assets/enemy_pawn/scene.gltf").scene), []); 
        const socket = useRef()

        useEffect(() => {

            

            socket.current = io("http://localhost:3001");

            //on close tout si fenetre fermée
            window.addEventListener('beforeunload', ()=>{
                socket.current.off("connect");
                socket.current.off("player_pos");
                socket.current.off("new_player");
                socket.current.close();
            });
            
            
            //reseau
            socket.current.on("connect", ()=>{
                console.log("connected");
                console.log(socket.id);
            });

            socket.current.on("sync", (players)=>{
                players.forEach((plr)=>{
                    if(playersClientDesieredPositions.current.has(plr.id)){
                        playersClientDesieredPositions.current.get(plr.id).ref.position.set(plr.x, 0.5, plr.z);
                        playersClientDesieredPositions.current.get(plr.id).x = plr.x_change
                        playersClientDesieredPositions.current.get(plr.id).z = plr.z_change
                    }
                    
                });
            });

            socket.current.on("player_pos", (id, x, z)=>{
                playersClientDesieredPositions.current.get(id).ref.position.x = x;
                playersClientDesieredPositions.current.get(id).ref.position.z = z;

            });

            socket.current.on("desired_player_pos", (id, x, z)=>{
                console.log("player "+id +" Wants position change: "+ x, z);
                let reference = playersClientDesieredPositions.current.get(id).ref;
                //idem que coté serveur, on recuupere les vieux delta pos et on leur ajoute les nouveaux delata pour obtenir un delta total
                let oldX = playersClientDesieredPositions.current.get(id).x;
                let oldZ = playersClientDesieredPositions.current.get(id).z;
                playersClientDesieredPositions.current.set(id, {ref:reference, x:(x+oldX), z:(z+oldZ)})
            });
                
            

            socket.current.on("new_player", (player)=>{
                
                console.log("new player");

                //on clone le mesh original et on l'ajoute à notre scene
                let clone = ennemy_pawn.clone();
                clone.scale.set(0.25,0.25,0.25);
                

                playersClientDesieredPositions.current.set(player.id, {ref:clone ,x:0, z:0});
                clone.position.set(player.x, 0.5, player.z);

                scene.add(clone);

                //setNbPlayers(nb_players+1);
            });

            socket.current.on("player_left", (id)=>{
                console.log("player left");
                
                //si un player part on delete son objet de la scene
                scene.remove(playersClientDesieredPositions.current.get(id).ref);
                playersClientDesieredPositions.current.delete(id);
            });

          
        return()=>{
            socket.current.off("connect");
            socket.current.off("player_pos");
            socket.current.off("new_player");
            socket.current.off("player_left");
            socket.current.off("desired_player_pos");
            socket.current.close();
        }
        }, []);

        

        const i = useRef(0);

        useFrame((state, d)=>{
            let delta = Math.min(0.2, d);
            i.current += 1;
            
            
            //console.log(Array.from(playersClientDesieredPositions.current));
            playersClientDesieredPositions.current.forEach((value, key) => {
                if(value.x!==0){
                    console.log(key);
                    value.ref.position.x += value.x*delta;
                    value.x -= value.x*delta;
                }
            });
           
             
        })


    return(
        <>
   
            
            <Chessboard/>
           
                {
                   /*  Array.from(playersClientDesieredPositions.current).map((plr)=>(
                    
                            <group ref={(reference) =>{playersClientDesieredPositions.current.set(plr[0], {ref:reference, x:0, z:0}); console.log("reference : "+reference)}} key={plr[0]} position={[1, 0.5, 1]}>
                                <Suspense>
                                    <Enemy_pawn/>
                                </Suspense>
                                
                            </group>
                        
                    )) */
                }
            
            <Suspense key={"1fgfg"}> 
                <Player myWantedPos={myWantedPos} myWantedPosChanged={myWantedPosChanged}/>
            </Suspense>

        </>
        
    );
}



  
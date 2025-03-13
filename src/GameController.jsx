import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, events, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


import Chessboard from './Chessboard';
import PlayerRook from './PlayerRook';
import Enemy_pawn from './Enemy_pawn';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';


//const socket = io("http://209.38.188.182:3001/"); 
//const socket = io("http://localhost:3001");

export default function GameController(){


        const [positionChosen, setChosen] = useState({x:-1,z:-1});

        useEffect(()=>{
            if (positionChosen.x !== -1){
                console.log("ONCOMMENCE");
                socket.current.emit("player_init", positionChosen.x, positionChosen.z);
            }
        },[positionChosen])

        
        const playersClientDesieredPositions = useRef(new Map()); //[key: id, value: {ref: reference de l'objet 3d, x:change_wanted, z:change_wanted, speed:number, direction:""}]
        let myWantedPos = useRef({x:0, z:0});

        
        const myWantedPosChanged = ()=>{
            console.log("emmited" + myWantedPos.current.x + myWantedPos.current.z);
            socket.current.emit("desired_player_pos", {x:myWantedPos.current.x, z:myWantedPos.current.z});
            
        };

        const {camera, scene} = useThree();
        
        const ennemy_pawn = useMemo(()=>(useLoader(GLTFLoader, "/assets/enemy_pawn_old/scene.gltf").scene), []); 
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
                        let player = playersClientDesieredPositions.current.get(plr.id);
                        player.ref.position.set(plr.x, 0.5, plr.z);
                        player.x = plr.x_change;
                        player.z = plr.z_change;
                        player.speed = plr.speed;
                        player.direction = plr.direction;
                        playersClientDesieredPositions.current.set(plr.id, player);
                        
                    }
                    
                });
            });

            socket.current.on("player_pos", (id, x, z)=>{
                playersClientDesieredPositions.current.get(id).ref.position.x = x;
                playersClientDesieredPositions.current.get(id).ref.position.z = z;

            });

            socket.current.on("desired_player_pos", (id, x, z)=>{
                //idem que coté serveur, on recuupere les vieux delta pos et on leur ajoute les nouveaux delata pour obtenir un delta total
                let player = playersClientDesieredPositions.current.get(id);
                player.x += x;
                player.z += z;
                //En gros meme delire que dans playerPawn, si mouvement dans la meme direction => vitesse augmente

                if(x>0){
                    if(player.direction == "+x")player.speed += 0.4;
                    else{
                        player.speed = 1; 
                        player.direction = "+x";
                    }
                }
                if(x<0){
                    if(player.direction == "-x")player.speed += 0.4;
                    else{
                        player.speed = 1; 
                        player.direction = "-x";
                    }
                }
                if(z>0){
                    if(player.direction == "+z")player.speed += 0.4;
                    else{
                        player.speed = 1; 
                        player.direction = "+z";
                    }
                }
                if(z<0){
                    if(player.direction == "-z")player.speed += 0.4;
                    else{
                        player.speed = 1; 
                        player.direction = "-z";
                    }
                }

               
                playersClientDesieredPositions.current.set(id, player);


            });
                
            

            socket.current.on("new_player", (player)=>{
                
                console.log("new player");

                //on clone le mesh original et on l'ajoute à notre scene
                let clone = ennemy_pawn.clone();
                clone.scale.set(0.25,0.25,0.25);
                

                playersClientDesieredPositions.current.set(player.id, {ref:clone ,x:0, z:0, speed:1, direction:""});
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

            socket.current.on("u_dead", ()=>{
                setChosen({x:-1,z:-1});
                camera.position.set(5,8,5);
                camera.lookAt(4,0,4);
                
            });


        
        //Clean UP  
        return()=>{
            socket.current.off("connect");
            socket.current.off("player_pos");
            socket.current.off("new_player");
            socket.current.off("player_left");
            socket.current.off("desired_player_pos");
            socket.current.close();

            

        }
        }, []);

        

        

        useFrame((state, d)=>{
            let delta = Math.min(0.2, d);

            
            
            
            
            playersClientDesieredPositions.current.forEach((value, key) => {
                console.log(value.speed);
                if(value.x > 0.05){
                    value.ref.position.x += delta*value.speed;
                    value.x -= delta*value.speed;
                }
                else if(value.x < -0.05){
                    value.ref.position.x -= delta*value.speed;
                    value.x += delta*value.speed;
                }
                else if(value.x != 0){
                    value.x = 0;
                    value.speed = 1;
                    value.ref.position.x = Math.round(value.ref.position.x);
                }



                if(value.z > 0.05){
                    value.ref.position.z += delta*value.speed;
                    value.z -= delta*value.speed;
                }
                else if(value.z < -0.05){
                    value.ref.position.z -= delta*value.speed;
                    value.z += delta*value.speed;
                }
                else if(value.z != 0){
                    value.z = 0;
                    value.speed = 1;
                    value.ref.position.z = Math.round(value.ref.position.z);
                }
            });

            
           
             
        })


    return(
        <>
   
            <Suspense>
                <Chessboard setChosen={setChosen}/>
            </Suspense>
            
           
                {
                   /*  Array.from(playersClientDesieredPositions.current).map((plr)=>(
                    
                            <group ref={(reference) =>{playersClientDesieredPositions.current.set(plr[0], {ref:reference, x:0, z:0}); console.log("reference : "+reference)}} key={plr[0]} position={[1, 0.5, 1]}>
                                <Suspense>
                                    <Enemy_pawn/>
                                </Suspense>
                                
                            </group>
                        
                    )) */
                }
            {positionChosen.x !=-1 && (
                <Suspense key={"1fgfg"}> 
                    <PlayerRook myWantedPos={myWantedPos} myWantedPosChanged={myWantedPosChanged} position={positionChosen}/>
                </Suspense>
            )}      
            

        </>
        
    );
}



  
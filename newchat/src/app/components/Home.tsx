"use client"
import React,{ useEffect,useState} from "react"
import Navbar from "@/app/components/Navbar"
import Phase1 from "@/app/components/Phase1"
import io from "socket.io-client"
import { SocketProvider, useSocket } from "@/app/provider/SocketProvider";

function Home() {
const socket=useSocket()!;

const [first, setfirst] = useState("")
useEffect(()=>{
    console.log('hi');
    
   
socket.emit("init","hello from frontend")
socket.on("init-b",(d)=>{
    setfirst(d)
    console.log("value",d);
    
})
    
return()=>{
    socket.disconnect()
}

},[socket])



  return (
    <div className='h-screen w-screen dark relative overflow-hidden'>
    <Navbar />
  
    
    <div>
      <Phase1 />
    </div>
    
    
    </div>
  )
}

export default Home



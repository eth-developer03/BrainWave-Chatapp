"use client"
// ALL NECESSARY IMPORTS
import React,{useEffect,useState} from 'react'
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios'
import { BackgroundBeams } from '../components/ui/background-beams';
import { useSocket } from '../provider/SocketProvider';
import { Socket } from 'socket.io-client';

export function page() {
  interface Mentor {
    Name: string;
    [key: string]: any; 
  }
  

const router=useRouter()


const socket=useSocket()!
  const [mentors, setmentors] = useState<Mentor[]>([])
  const handleAll=async()=>{
      console.log("start");
      
      const resp=await axios.get("http://localhost:5000/allMentor")
      setmentors(resp.data)
      console.log(resp.data);
      
  
  }
  useEffect(() => {
      handleAll()
  },[])
    const chatroomId = uuidv4();



  const getNewChatRoom = (mentorName:string) => {
    try {
      console.log("Creating chat room for mentor:", mentorName);
      const chatroomId = uuidv4();
      console.log("Chatroom ID:", chatroomId);
      socket.emit("Mentor-info",mentorName)
      router.push(`/chat/${chatroomId}`);
      
    } catch (error) {
      console.log("new error",error);
      
      
    }

  };

  return (
    <div className='dark bg-black h-screen w-screen text-white flex justify-center items-center flex-wrap flex-col'>
           <div className='mb-12 text-4xl items-center' style={{fontWeight:900}}>
            MENTOR'S LIST
           </div>

<div className='z-50'>


{
  // SHOWING MENTOR'S LIST 
    mentors.map((mentor,index)=>{
        return (<div key={index} className="text-white flex flex-wrap gap-3 m-2">
          <div>

      <h1 className='text-xl'> Mentor : <span className='text-3xl text-gray-500' style={{fontWeight:600}}>{mentor?.Name}  </span> </h1>
      </div>

<div>

      <button 
      
      className="hover:bg-gray-300 p-2 rounded bg-white text-black m-1"
      onClick={()=>getNewChatRoom(mentor?.Name)}

      >
            Connect
          </button>
          </div>


        </div>
        )
    }
)

}
</div>

<div>
<BackgroundBeams />

</div>






    </div>
  )
}

export default page
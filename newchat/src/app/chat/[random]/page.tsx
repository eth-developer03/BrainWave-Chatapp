"use client"
import React, { ReactEventHandler, useCallback, useEffect, useState,useMemo} from 'react';
import axios from 'axios';
import { useSocket } from '@/app/provider/SocketProvider'; // From providers
import { io } from 'socket.io-client'; 
import "./chat.css"
import { useRouter } from 'next/navigation'
import { SpotlightPreview } from '@/app/components/SplotlightPreview';
interface IMessage {
    sender: string;
    content: string;
    timestamp: Date;
  }
  interface IChat extends Document {
    currentUser:String;
    messages: IMessage;
  }
function ChatRoomPage() {
  const router = useRouter()
  const socket = useMemo(() => io("http://localhost:5000"), []);

  // const socket = useSocket()!;

  const [newSender, setSender] = useState<string>('k');
  const [content, setContent] = useState<string>('');

const [show, setshow] = useState(true)
  const [allMessages, setMessages] = useState<IMessage[]>([]);


  // Function to initialize chat and listen for socket events
  const initializeChat = useCallback(() => {
    socket.emit("chat-init", "kar");
    socket.emit("received-mentor", "send");

   socket.on("User-info", (d) => {
      console.log("User name is ", d);
      setSender(d);
      console.log("here ",newSender);


      
    });

    socket.on("Got-Mentor", (d) => {
      console.log("Mentor name is ", d);
    });

    // Clean up socket event listeners when component unmounts
    return () => {
      socket.off("User-info");
      socket.off("Got-Mentor");
    };  
  },[socket]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    
 
    console.log("curent user name ",newSender);

    

const message={
    currentUser:newSender,
    newSender,
    content,
}

console.log("In progress");
console.log("message sent again",message);

try{
  socket.emit("data-sent",{message})
  setContent("")
  console.log("end of message");
  
  fetchMessages()

}catch(e){
console.log(e);

}
   
    
  };
  const fetchMessages = useCallback(async () => {
    console.log("sender is ",newSender);
    
    try {
        if(newSender==undefined || newSender == null || newSender==""){
            setSender("k")
            console.log("done");
            
        }
      
          
  




          const response = await axios.get(`http://localhost:5000/chatroom/${newSender}/messages`);
          const data: IChat[] = await response.data;

          console.log("final received chat", data);

          // Flatten and sort messages
          const flattenedMessages: IMessage[] = data.flatMap((chat: IChat) => chat.messages);
          flattenedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

          setMessages(flattenedMessages);
          console.log("total messages", flattenedMessages);


      
    
      console.log("total ", allMessages);
      
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

  },[]);



  const updateHeight = () => {
    const element = document.getElementById('chat');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };


  useEffect(() => {
socket.on("refresh-messages",(d)=>{
  fetchMessages()

})


    socket.on("receiving-message", (data:any) => {

        fetchMessages();
        console.log("came back");
        


    })
    socket.on("k",(d)=>{
      console.log("start is from ",d);
      
    })
 
    initializeChat();

    // Fetch last 10 messages when component mounts
    fetchMessages();





    setTimeout(() => {
      updateHeight();
    }, 100);
    // Clean up socket event listener for new messages

    return () => {
      socket.off("refresh-messages");
    };
  }, [socket]);

  // Function to fetch last 10 messages from backend


  return (
    <div className='h-screen w-screen flex flex-wrap bg-black'>
      <div className='relative z-50 h-full w-full m-0'>
        <div className='text-white hover:cursor-pointer' onClick={()=>{router.push("/")}}> 🔙 EXIT</div>
      <div className='text-gray-400 text-3xl flex justify-center' style={{fontWeight:900,textShadow:"4px"}}>
        
        ChatRoom (Mentor & Student) 
       
      </div>
      <div className='h-[80vh] overflow-y-scroll relative' id="chat">
 



        <ul>
                    {allMessages && allMessages.map((message, index) => (
                        <li key={index} className='m-2 relative'>
                          <span className={newSender === message.sender ? 'flex justify-end text-right w-[26vw] ml-auto p-2 text-white rounded-lg bg-slate-600' : 'flex justify-start text-left ml-auto p-2 bg-transparent text-gray-300 rounded-lg'}>
                            <strong className=''>{message.sender}</strong>: {message.content} <em>({new Date(message.timestamp).toLocaleTimeString()})</em>


                            </span>
                        </li>
                    ))}
                </ul>



      </div>
      <div className='bg-black absolute w-screen flex flex-wrap flex-row items-center m-0'>
        <div className='cinput'>
        <input
          type="text"
          className='lg:w-[90vw] ml-1'  
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        </div>
        <div>
        <button onClick={(e:any) => handleSubmit(e)} className='p-3 m-3 bg-slate-200 rounded-lg'>
          Submit
        </button>
        </div>
      </div>
    
    </div>
    <div className='h-screen absolute inset-0'>
      <SpotlightPreview/>
    </div>
    </div>
  );
}

export default ChatRoomPage;

// Socket's Setup
import {Server as SocketIOServer} from "socket.io"
const socketInit=(server:any)=>{
    const io=new SocketIOServer(server,{
        cors: {
            origin: "http://localhost:3000", 
            methods: ["GET", "POST"] 
          }
        
    })
    return io;
}
export default socketInit
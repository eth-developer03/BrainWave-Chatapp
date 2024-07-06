"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const allSchemas_1 = require("./models/allSchemas");
const socket_1 = __importDefault(require("./socket/socket"));
const Connect_1 = __importDefault(require("./db/Connect"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = (0, socket_1.default)(server);
(0, Connect_1.default)();
var userName;
var mentorName;
io.on("connection", (socket) => {
    console.log("connected ", socket.id);
    socket.emit("k", "aaa");
    console.log("sent stRT");
    socket.on("chat-init", (d) => {
        console.log("chat half done");
        socket.emit("User-info", userName);
    });
    socket.on("received-mentor", (d) => {
        console.log("mentor name", mentorName);
        socket.emit("Got-Mentor", mentorName);
    });
    socket.on("Mentor-info", (d) => {
        console.log("Mentor-info", d);
        mentorName = d;
        console.log("name assigned is ", mentorName);
    });
    //     socket.on("data-sent",async(data)=>{
    // const{currentUser,sender,content}=data
    // console.log("the data is ",data);
    //         const message: IChatMessage = {
    //             sender: sender, // Ensure sender is passed as string
    //             content: content,
    //             timestamp: new Date(),
    //           };
    //           const updatedChat = await Chat.findOneAndUpdate(
    //             { currentUser },
    //             { $push: { messages: message } },
    //             { new: true }
    //           );
    //           if (!updatedChat) {
    //             console.log("chat not found");
    //             const newAdd=new Chat({
    //                 currentUser:currentUser,
    //                 messages:[message]
    //             })
    //           }
    //           socket.emit("receiving-message","sending from backend")
    //     })
    // socket.on("data-sent", async (data) => {
    //     const { currentUser, sender, content } = data;
    //     console.log("the data is ", data);
    //     const newIDofSender=await User.findOne({Name:data.message.currentUser})
    //     if (!newIDofSender) {
    //         throw new Error("Sender not found");
    //     }
    //     const message: IChatMessage = {
    //         sender: newIDofSender?._id || sender, // Ensure sender is passed as string
    //         content: data.message.content,
    //         timestamp: new Date(),
    //     };
    // console.log(message);
    //     try {
    //         const updatedChat = await Chat.findOneAndUpdate(
    //             { currentUser },
    //             { $push: { messages: message } },
    //             { new: true }
    //         );
    //         console.log("updated chats");
    //         if (!updatedChat) {
    //             console.log("chat not found");
    //             const newChat = new Chat({
    //                 currentUser: data.message.currentUser,
    //                 messages: [message]
    //             });
    //             await newChat.save();
    //             console.log("data is saved");
    //             socket.emit("receiving-message", "sending from backend");
    //         } else {
    //             socket.emit("receiving-message", "sending from backend");
    //         }
    //     } catch (error) {
    //         console.error("Error in updating chat:", error);
    //     }
    // });
    socket.on("data-sent", async (data) => {
        socket.broadcast.emit("refresh-messages", "order from backend");
        console.log("data-sent event received", data);
        try {
            const { currentUser, sender, content } = data.message;
            console.log("Parsed data: ", { currentUser, sender, content });
            const newIDofSender = await allSchemas_1.User.findOne({ Name: data.message.currentUser });
            if (!newIDofSender) {
                console.log("Sender not found");
                throw new Error("Sender not found");
            }
            console.log("Sender found: ", newIDofSender);
            const message = {
                sender: newIDofSender?._id || sender,
                content: data.message.content,
                timestamp: new Date(),
            };
            console.log("Message to save: ", message);
            const updatedChat = await allSchemas_1.Chat.findOneAndUpdate({ currentUser }, { $push: { messages: message } }, { new: true });
            if (!updatedChat) {
                console.log("Chat not found, creating new chat");
                const newChat = new allSchemas_1.Chat({
                    currentUser: data.message.currentUser,
                    messages: [message]
                });
                await newChat.save();
                console.log("New chat saved");
                socket.emit("receiving-message", "sending from backend");
            }
            else {
                console.log("Chat updated");
                socket.emit("receiving-message", "sending from backend");
            }
        }
        catch (error) {
            console.error("Error in updating chat:", error);
        }
    });
    socket.on("send-message", async (data) => {
        console.log("Received new message:", data);
        try {
            // Assuming data includes chatId and message content
            const { chatId, sender, content } = data;
            // Find the chat by chatId
            const chat = await allSchemas_1.Chat.findOne({ chatId });
            if (!chat) {
                console.log("Chat not found for chatId:", chatId);
                socket.emit("Failed", "No room has been created");
                return;
            }
            const newMessage = {
                sender,
                content,
                timestamp: new Date(),
            };
            // Add message to the chat
            chat.messages.push(newMessage);
            await chat.save();
            // Emit the new message to all connected clients
            io.emit("new-message", { chatId, sender, content });
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
    });
});
// app.get("/chatroom/:currentUser/messages", async (req, res) => {
//   const { currentUser } = req.params;
//   console.log("current user is ",currentUser);
//   try {
//     // Fetch the chat by chatId from MongoDB
//     const chat = await Chat.findOne({ currentUser });
//     const selectedUser=await User.findOne({Name:currentUser})
//     if (!chat) {
//       console.log("ChatRoom Doesnt Exist");
//      const newchat = new Chat({ currentUser,
//         participants[selectedUser._id],
//          messages: [] });
//       // Save the newly created chat
//       await newchat.save();
//       return res.json({Message:"Chat Room has been Created"})
//     }
//     // Get the last 10 messages sorted by timestamp
//     const lastMessages = chat.messages
//       .slice(-10) // Get the last 10 messages
//       .map((message) => ({ sender: message.sender, content: message.content }));
//     res.status(200).json(lastMessages);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// app.get("/chatroom/:currentUser/messages", async (req, res) => {
//     const { currentUser } = req.params;
//     console.log("current user is ", currentUser);
//     try {
//       // Fetch the user by currentUser name
//       const selectedUser = await User.findOne({ Name: currentUser });
//       if (!selectedUser) {
//         return res.status(404).json({ error: "User not found" });
//       }
//       // Fetch the chat by participants
//       const chat = await Chat.findOne({ participants: selectedUser._id });
//       if (!chat) {
//         console.log("ChatRoom Doesn't Exist");
//         // Create a new chat with participants array
//         const newChat = new Chat({
//           currentUser: currentUser, // Add currentUser to the chat
//           participants: [selectedUser._id], // Add the selected user's ID
//           messages: [selectedUser._id]
//         });
//         // Save the newly created chat
//         await newChat.save();
//         return res.json({ Message: "Chat Room has been Created" });
//       }
//       // Get the last 10 messages sorted by timestamp
//       const lastMessages = chat.messages
//         .slice(-10) // Get the last 10 messages
//         .map((message) => ({ sender: message.sender, content: message.content }));
//       res.status(200).json(lastMessages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   });
//   app.get("/chatroom/:currentUser/messages", async (req, res) => {
//     const { currentUser } = req.params;
//     console.log("current user is ", currentUser);
//     try {
//         // Fetch the user by currentUser name
//         // const chat = await Chat.findOne({ currentUser }).populate('messages.sender');
//         const selectedUser = await User.findOne({ Name: currentUser });
//         if (!selectedUser) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         // Fetch the chat by participants
//         const chat = await Chat.findOne({ participants: selectedUser._id });
//         if (!chat) {
//             console.log("ChatRoom Doesn't Exist");
//             // Create a new chat with participants array
//             const newChat = new Chat({
//                 currentUser: currentUser,
//                 participants: [selectedUser._id],
//                 messages: [
//                     {
//                         sender: selectedUser._id,
//                         content: "Welcome to the chat room",
//                         timestamp: new Date()
//                     }
//                 ]
//             });
//             console.log("show newchat",newChat);
//             // Save the newly created chat
//             await newChat.save();
//             return res.json({ Message: "Chat Room has been Created" });
//         }
//         // Get the last 10 messages sorted by timestamp
//         const lastMessages = chat.messages
//             .slice(-10) // Get the last 10 messages
//             .map((message) => ({ sender: message.sender.Name, content: message.content, timestamp: message.timestamp }));
//         res.status(200).json(lastMessages);
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });
app.get("/chatroom/:currentUser/messages", async (req, res) => {
    const { currentUser } = req.params;
    try {
        // Fetch the chat by participants
        // const chat = await Chat.findOne({ currentUser });
        // const chat = await Chat.find();
        // await chat?.populate("messages.sender")
        const chats = await allSchemas_1.Chat.find().populate("messages.sender", "Name");
        console.log("chat is moved forward");
        if (!chats) {
            // return res.status(404).json({ error: "No chats found" });
            console.log("ChatRoom Doesn't Exist");
            //     // Create a new chat with participants array
            const selectedUser = await allSchemas_1.User.findOne({ Name: currentUser });
            if (!selectedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            console.log("here hello");
            const newChat = new allSchemas_1.Chat({
                currentUser: currentUser,
                participants: [selectedUser._id],
                messages: [{
                        sender: selectedUser._id,
                        content: "Welcome to the chat room",
                        timestamp: new Date()
                    }]
            });
            await newChat.save();
            console.log("user saved");
            return res.json({ Message: "Chat Room has been Created" });
        }
        // const formattedChats = chats.map(chat => ({
        //     currentUser: chat.currentUser,
        //     messages: chat.messages.map(message => ({
        //       sender: message?.sender || "Unknown",
        //       content: message.content,
        //       timestamp: message.timestamp,
        //     })),
        //   }));
        console.log("hhello2");
        const formattedChats = await chats.map(chat => ({
            currentUser: chat.currentUser,
            messages: chat.messages
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // Sort messages by timestamp
                .map(message => ({
                sender: message.sender?.Name || "Unknown", // Type assertion to ensure sender has Name
                content: message.content,
                timestamp: message.timestamp,
            })),
        }));
        console.log("hhello3");
        return res.status(200).json(formattedChats);
        // if (!chat) {
        //     console.log("ChatRoom Doesn't Exist");
        //     // Create a new chat with participants array
        //     const selectedUser = await User.findOne({ Name: currentUser });
        //     if (!selectedUser) {
        //         return res.status(404).json({ error: "User not found" });
        //     }
        //     const newChat = new Chat({
        //         currentUser: currentUser,
        //         participants: [selectedUser._id],
        //         messages: [{
        //             sender: selectedUser._id,
        //             content: "Welcome to the chat room",
        //             timestamp: new Date()
        //         }]
        //     });
        //     await newChat.save();
        //     return res.json({ Message: "Chat Room has been Created" });
        // }
        // Get the last 10 messages sorted by timestamp
        // const lastMessages = chat.messages
        //     .slice(-10) // Get the last 10 messages
        //     .map((message) => ({
        //         sender: message.sender || "Student", // Access the populated sender's Name
        //         content: message.content,
        //         timestamp: message.timestamp
        //     }));
        // const lastMessages=chat;
        // res.status(200).json(lastMessages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ error: "Server error" });
    }
});
app.get("/allMentor", async (req, res) => {
    console.log("start");
    const resp = await allSchemas_1.User.find({ Role: "Mentor" });
    res.send(resp);
});
// Example route handler for adding a message to a chat
app.post('/add-message', async (req, res) => {
    const { currentUser, sender, content } = req.body; // Assuming chatId, sender, and content are passed in the request body
    try {
        // Create a new message object
        const message = {
            sender: sender, // Ensure sender is passed as string
            content: content,
            timestamp: new Date(),
        };
        // Find the chat by chatId and push the new message
        const updatedChat = await allSchemas_1.Chat.findOneAndUpdate({ currentUser }, { $push: { messages: message } }, { new: true });
        if (!updatedChat) {
            // return res.status(404).json({ error: 'Chat not found' });
            console.log("chat not found");
            // const newMessage=await Chat({
            //     currentUser,
            //     messages:[message],
            //     timestamp:new Date(),
            // })
            // await newMessage.save();
        }
        console.log('Message added:', message);
        res.status(200).json(updatedChat); // Respond with the updated chat object
    }
    catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post("/submit", async (req, res) => {
    const { Name, Email, Password, Age, Role } = req.body;
    console.log("body is", req.body);
    const newUser = new allSchemas_1.User({ Name, Email, Password, Age, Role });
    const existingStudent = await allSchemas_1.User.findOne({ Email });
    if (existingStudent || existingStudent != null) {
        const isValidPassword = existingStudent.validPassword(Password);
        if (!isValidPassword) {
            res.status(400).send('Invalid Password');
            console.log("Invalid password");
            return;
        }
        console.log("password right");
        // io.emit("User-info",existingStudent.Name)
        userName = newUser.Name;
        console.log("user name is", userName);
        res.status(200).send("Logged In Successfully !!!! ");
        return;
    }
    else {
        await newUser.setPassword(Password);
        const savedUser = await newUser.save();
        console.log("new user created");
        res.status(201).json(savedUser);
        // io.emit("User-info",newUser.Name)
        userName = newUser.Name;
        return;
    }
});
server.listen(process.env.PORT, () => {
    console.log(`Listening at Port ${process.env.PORT}`);
});

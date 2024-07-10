"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
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
io.on('connection', (socket) => {
    console.log('connected ', socket.id);
    socket.emit('k', 'aaa');
    console.log('sent stRT');
    socket.on('chat-init', (d) => {
        console.log('chat half done');
        console.log('sending username', userName);
        socket.emit('User-info', userName);
    });
    socket.on('received-mentor', (d) => {
        console.log('mentor name', mentorName);
        socket.emit('Got-Mentor', mentorName);
    });
    socket.on('Mentor-info', (d) => {
        console.log('Mentor-info', d);
        mentorName = d;
        console.log('name assigned is ', mentorName);
    });
    // RealTime Communication
    socket.on('data-sent', async (data) => {
        socket.broadcast.emit('refresh-messages', 'order from backend');
        console.log('data-sent event received', data);
        try {
            const { currentUser, sender, content } = data.message;
            console.log('Parsed data: ', { currentUser, sender, content });
            const newIDofSender = await allSchemas_1.User.findOne({
                Name: data.message.currentUser,
            });
            if (!newIDofSender) {
                console.log('Sender not found');
                throw new Error('Sender not found');
            }
            console.log('Sender found: ', newIDofSender);
            const message = {
                sender: newIDofSender?._id || sender,
                content: data.message.content,
                timestamp: new Date(),
            };
            console.log('Message to save: ', message);
            const updatedChat = await allSchemas_1.Chat.findOneAndUpdate({ currentUser }, { $push: { messages: message } }, { new: true });
            if (!updatedChat) {
                console.log('Chat not found, creating new chat');
                const newChat = new allSchemas_1.Chat({
                    currentUser: data.message.currentUser,
                    messages: [message],
                });
                await newChat.save();
                console.log('New chat saved');
                socket.emit('receiving-message', 'sending from backend');
            }
            else {
                console.log('Chat updated');
                socket.emit('receiving-message', 'sending from backend');
            }
        }
        catch (error) {
            console.error('Error in updating chat:', error);
        }
    });
    socket.on('send-message', async (data) => {
        console.log('Received new message:', data);
        try {
            // Assuming data includes chatId and message content
            const { chatId, sender, content } = data;
            // Find the chat by chatId
            const chat = await allSchemas_1.Chat.findOne({ chatId });
            if (!chat) {
                console.log('Chat not found for chatId:', chatId);
                socket.emit('Failed', 'No room has been created');
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
            io.emit('new-message', { chatId, sender, content });
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
    });
});
// Fetching Data in Backend
app.get('/chatroom/:currentUser/messages', async (req, res) => {
    const { currentUser } = req.params;
    try {
        const chats = await allSchemas_1.Chat.find().populate('messages.sender', 'Name');
        console.log('message has moved forward');
        if (!chats) {
            console.log("ChatRoom Doesn't Exist");
            // Create a new chat with participants array
            const selectedUser = await allSchemas_1.User.findOne({ Name: currentUser });
            if (!selectedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            console.log('here hello');
            const newChat = new allSchemas_1.Chat({
                currentUser: currentUser,
                participants: [selectedUser._id],
                messages: [
                    {
                        sender: selectedUser._id,
                        content: 'Welcome to the chat room',
                        timestamp: new Date(),
                    },
                ],
            });
            await newChat.save();
            console.log('user saved');
            return res.json({ Message: 'Chat Room has been Created' });
        }
        console.log('hhello2');
        const formattedChats = await chats.map((chat) => ({
            currentUser: chat.currentUser,
            messages: chat.messages
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // Sort messages by timestamp
                .map((message) => ({
                sender: message.sender?.Name || 'Unknown', // Type assertion to ensure sender has Name
                content: message.content,
                timestamp: message.timestamp,
            })),
        }));
        console.log('hhello3');
        return res.status(200).json(formattedChats);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});
app.get('/allMentor', async (req, res) => {
    console.log('start');
    const resp = await allSchemas_1.User.find({ Role: 'Mentor' });
    res.send(resp);
});
// Saving The User
app.post('/submit', async (req, res) => {
    const { Name, Email, Password, Age, Role } = req.body;
    console.log('body is', req.body);
    const newUser = new allSchemas_1.User({ Name, Email, Password, Age, Role });
    const existingStudent = await allSchemas_1.User.findOne({ Email });
    if (existingStudent || existingStudent != null) {
        const isValidPassword = existingStudent.validPassword(Password);
        // Checking for login
        if (!isValidPassword) {
            res.status(400).send('Invalid Password');
            console.log('Invalid password');
            return;
        }
        console.log('password right');
        userName = newUser.Name;
        console.log('user name is', userName);
        res.status(200).send('Logged In Successfully !!!! ');
        return;
    }
    else {
        await newUser.setPassword(Password);
        const savedUser = await newUser.save();
        console.log('new user created');
        res.status(201).json(savedUser);
        userName = newUser.Name;
        return;
    }
});
server.listen(process.env.PORT, () => {
    console.log(`Listening at Port ${process.env.PORT}`);
});

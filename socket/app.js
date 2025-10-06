import {Server, Socket} from "socket.io";


const io = new Server({
    cors:{
        origin: "http://localhost:5173"
        // origin: "http://192.168.29.129:5173"
    },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
    const userExists = onlineUser.find(user => user.userId === userId);
    if(!userExists){
        onlineUser.push({
            userId,
            socketId
        })
    }
}

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return onlineUser.find( user => user.userId === userId)
}

io.on("connection", (socket) => {
    console.log(socket.id);
    // socket.on("test", (data) => { console.log(data) })

    socket.on("newUser", (userId) => {
        addUser(userId, socket.id);
        // console.log(onlineUser);
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
        // console.log(receiverId);
        const receiver = getUser(receiverId);
        // console.log(receiver);
        
        io.to(receiver?.socketId).emit("getMessage", data);
        
    })

    socket.on("disconnect", (socketId) => {
        removeUser(socket.id);
    })
});

io.listen("4000")
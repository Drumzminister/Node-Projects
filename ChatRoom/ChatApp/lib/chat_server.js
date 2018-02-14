import { userInfo } from "os";

var socketio = require("socket.io");
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server){
    
    // Start Socket IO Server, piggybacking HTTP server
    io = socketio.listen(server);
    io.serveClient("log level", 1);

    // Define how each request is handled
    io.sockets.on("connection", function(socket){
    
        // Assing user a guest name when they connnect
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    
        // Place user in lobby when they connect
        joinRoom(socket, "Lobby");
    
        // Handle User Messages, name changing attempts, and room creation/changes
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangingAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        // Provides list of occupied rooms
        socket.on("rooms", function(){
            socket.emit("rooms", io.sockets.manager.rooms);
        });
    
        // define cleanup logic on dissconnection
        handleClientDisconnection(socket, nickNames, namesUsed)
    });
};

// Assign Guest Names
function assignGuestName(socket, guestName, nickNames, namesUsed){

    // Generate new guest name
    var name = "Guest" + guestNumber;
    nickNames[socket.id] = name;
    socket.emit("nameResult", {
        success: true,
        name: name
    });
    namesUsed.push(name);
    // Increment guest Number
    return guestNumber + 1;
}

// Joining Rooms
function joinRoom(socket, room){
    // Make User join room
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit("joinResult", {room: room});
    // Let other user know that a new person has joined
    socket.broadcast.to(room).emit("message", {
        text: nickNames[socket.id] +" has joined" + rooms + "-"
    });

    var usersInRoom = io.sockets.clients(room);
    if(usersInRoom.length > 1){
        var usersInRoomSummary = "Users currently in " + room + ": ";
        for(var index in usersInRoom){
            var userSocketId = usersInRoom[index].id;
            if(userSocketId != socket.id){
                if( index > 0){
                    usersInRoomSummary += ", ";
                }
                usersInRoomSummary += nicknames[userSocketId]
                }
            }
            usersInRoomSummary += "-";
            socket.emit("message", { text: usersInRoomSummary});
    }
}


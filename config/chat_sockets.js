// To receive the request for establishing a connection, we need a { chat_socket.js }
// file.
// ● Whenever a connection request is received, the server automatically will send back
// the acknowledgment to the frontend.
// ● Whenever the client disconnects from the server, an automatic disconnect event is
// fired.


module.exports.chatSockets= function(socketServer){
    const io =require('socket.io')(socketServer,{
        cors: {
            origin: "http://localhost:9356",
            methods: ["GET", "POST"]
        }
    });

    io.sockets.on('connection',function(socket){
        console.log('new connection received',socket.id);

        socket.on('disconnect',function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room',function(data){
            console.log('joining request rec.',data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data);
        });
// changes:detect message and broadcast it to everyone in the chatroom 
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        });
    });



}
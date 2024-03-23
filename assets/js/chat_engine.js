// We will create a connection, Handler, that has to and fro interaction between the server and user

class chatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;

        this.socket=io.connect('http://localhost:7856');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    createMessagePill(data){

        let senderMail = data.user_email;
        let msg = data.msg
        console.log("create");
        let messageType = 'other-message' ;
        if(senderMail === this.userEmail){
            messageType = 'self-message';
        }

        return $(`
        <li class="${messageType}">
            <span>${msg}</span>
            <div class="user-mail">${senderMail}</div>
        </li>
        `)

    }

    connectionHandler(){
        let self=this;
        this.socket.on('connect',function(){
            console.log('connection established using socket....!');


            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'codeial'
            });
    
            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);
            })
        });


        //change:send a message on clicking on the send message button
        $('#send-message').click(function(){
            console.log('sending');
            let msg=$('#chat-message-input').val();
    
            if(msg!=''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email:self.userEmail,
                    chatroom:'codeial'
                });
            }
        });

        self.socket.on('receive_message',function(data){
            console.log('message received',data.message);

            let newMessage=$('<li>');

            let messageType= 'other-message';

            if(data.user_email==self.userEmail){
                messageType:'self-message';
            }

            newMessage.append($('<span>',{
                'html':data.message
            }));

            newMessage.append($('<sub>',{
                'html':data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);


        })
        
    }


   
}
// import { useEffect } from 'react';
// import { socket } from '../../app/App';

import './chatroom.css';
import ChatBox from '../../components/chatbox/chatbox';
import Messages from '../../components/messages/messages';
import SideMenu from '../../components/sidemenu/sidemenu';
import RoomPanel from '../../components/roompanel/roomPanel';

export default function Chatroom(){

    // useEffect(() => {
    //     socket.connect();
    //     socket.emit("rooms", "my rooms");   
    //     socket.on("rooms" , data => {
    //         console.log("")
    //         console.log(data)
    //     })
    //     socket.on("connect_error", (err) => {
    //         console.log(err.data)
    //     })
    // }, [])

    return (
        <div className="chatroom-container">
            <div className="chatroom">
                <div className="side-menu">
                    <SideMenu />
                </div>
                <div className="chat-area">
                    <div className="room-panel">
                        <RoomPanel/>
                    </div>
                    <div className="messages">
                        <Messages />
                    </div>
                    <div className="chat-box">
                        <ChatBox />
                    </div>
                </div>                
            </div>
        </div>
    )

}
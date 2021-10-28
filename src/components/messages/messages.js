import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../app/App";
import { currentUserRoom } from "../chatbox/chatboxSlice";
import './messages.css';

export default function Messages(){

    const [newMessage, setNewMessage] = useState("");
    const currentRoom = useSelector(currentUserRoom);
    const [roomName, setRoomName] = useState("");

    useEffect(() => {
        setRoomName(currentRoom.name);
    }, [currentRoom])

    socket.on("receive-message", data => {
        console.log(data)
        setNewMessage(data);
    });

    return (
        <div className="message-container">
            <div className="message-header">
                <div className="room-info">
                    <div className="room-name">
                        <h2>Room name: {roomName}</h2>
                    </div>        
                    <div className="room-options">
                        <h3>Current capacity: 1/8</h3>
                        <button>Leave room</button>
                    </div>            
                </div>

            </div>
            {newMessage}
        </div>
    )

}
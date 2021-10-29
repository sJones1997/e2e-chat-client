import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../app/App";
import { getRoomInfo, roomInfo, leaveRoom, userPrompt, userPromptMessage } from "./messageSlice";
import { currentUserRoom } from "../chatbox/chatboxSlice";
import './messages.css';
import { useDispatch } from "react-redux";

export default function Messages(){

    const [newMessage, setNewMessage] = useState("");
    const currentRoom = useSelector(currentUserRoom);
    const [roomName, setRoomName] = useState("");
    const roomDetails = useSelector(roomInfo);
    const [roomLimit, setRoomLimit] = useState(0);
    const [roomCapacity, setRoomCapacity] = useState(0);
    const userPromptRequired = useSelector(userPrompt);
    const userMessage = useSelector(userPromptMessage);

    const dispatch = useDispatch();

    useEffect(() => {
        if(Object.keys(currentRoom).length){
            dispatch(getRoomInfo({id: currentRoom.id}));
            setRoomName(currentRoom.name);
        }
    }, [currentRoom, dispatch]);

    useEffect(() => {
        setRoomLimit(roomDetails.limit);
        setRoomCapacity(roomDetails.roomCapacity);
    }, [roomDetails])

    socket.on("receive-message", data => {
        setNewMessage(data);
    });

    const leaveCurrentRoom = () => {
        dispatch(leaveRoom({id: currentRoom.id}))
    }

    useEffect(() => {
        if(userPromptRequired){
            const overlay = document.querySelector(".overlay")
            overlay.style.display = "block";  
        } else {
            const overlay = document.querySelector(".overlay")
            overlay.style.display = "none";              
        }
    }, [userPromptRequired])

    return (
        <div className="message-container">
            <div className="message-header">
                <div className="room-info">
                    <div className="room-name">
                        <h2>Room name: {roomName}</h2>
                    </div>        
                    <div className="room-options">
                        <h3>Current capacity: {roomCapacity}/{roomLimit}</h3>
                        <button onClick={() => leaveCurrentRoom()}>Leave room</button>
                    </div>            
                </div>

            </div>
            {newMessage}
            <div className="prompt-modal" style={{display: userPromptRequired ? 'flex' : 'none' }}> 
                <div className="user-message">
                    <h2>{userMessage}</h2>
                </div>
                <div className="leave-options">
                    <button className="stay">Stay</button>
                    <button className="leave">Leave room</button>
                </div>
            </div>            
        </div>
    )

}
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../app/App";
import { getRoomInfo, roomInfo } from "./messageSlice";
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

    const leaveRoom = () => {
        console.log(currentRoom.id);
    }

    return (
        <div className="message-container">
            <div className="message-header">
                <div className="room-info">
                    <div className="room-name">
                        <h2>Room name: {roomName}</h2>
                    </div>        
                    <div className="room-options">
                        <h3>Current capacity: {roomCapacity}/{roomLimit}</h3>
                        <button onClick={() => leaveRoom()}>Leave room</button>
                    </div>            
                </div>

            </div>
            {newMessage}
        </div>
    )

}
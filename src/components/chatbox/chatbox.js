
import { useEffect, useState } from 'react'
import './chatbox.css'
import { currentUserRoom } from './chatboxSlice';
import { socket } from '../../app/App';
import { useSelector } from 'react-redux';

export default function ChatBox() {

    const [message, setMessage] = useState("");
    const userRoom = useSelector(currentUserRoom);
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(roomName && roomId){
            socket.emit("message", message, roomName)            
        } else {
            console.log("No room!")
        }
    }

    useEffect(() => {
        setRoomName(userRoom.name);
        setRoomId(userRoom.id);
        setMessage('');
    }, [userRoom])


    return (
        <div className="chat-box-container">
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <input disabled={roomName && roomId ? '' : "disabled"} type="text" placeholder="Enter your message here..." value={message} onChange={(e) => setMessage(e.target.value)}/>
                <input  disabled={roomName && roomId ? '' : "disabled"} type="submit" value="Send" />
            </form>
        </div>
    )
}
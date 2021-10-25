
import { useState } from 'react'
import './chatbox.css'
import { socket } from '../../app/App';

export default function ChatBox() {

    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(socket)
        socket.emit("message", message)
    }

    return (
        <div className="chat-box-container">
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <input type="text" placeholder="Enter your message here..." value={message} onChange={(e) => setMessage(e.target.value)}/>
                <input type="submit" value="Send" />
            </form>
        </div>
    )
}
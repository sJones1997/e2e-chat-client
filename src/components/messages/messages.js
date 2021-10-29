import { useState } from "react";
import { socket } from "../../app/App";
import { useDispatch } from "react-redux";
import './messages.css';

export default function Messages(){

    const [newMessage, setNewMessage] = useState("");

    const dispatch = useDispatch();


    return (
        <div className="message-container">
            <div className="message-header">
            </div>
            {newMessage}          
        </div>
    )

}
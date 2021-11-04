import { socket } from "../../app/App";
import { useDispatch } from "react-redux";
import {roomMessages} from './messageSlice';
import './messages.css';
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Messages(){

    const messages = useSelector(roomMessages);
    const dispatch = useDispatch();

    useEffect(() => {

    }, [])

    return (
        <div className="message-container">
            <div className="room-messages">
                {
                    messages.map((e,i) => (
                    <div className={e.local_user ? 'message user-message-local' : 'message user-message-public'} key={i}>
                        {e.message}
                    </div>
                    ))
                }                   
            </div>       
        </div>
    )

}
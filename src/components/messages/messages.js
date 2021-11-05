import { socket } from "../../app/App";
import aes256 from "aes256";
import { useDispatch } from "react-redux";
import {roomMessages, getEncryptedRoomMessages, encryptedMessages, setRoomMessages, newLocalMessage} from './messageSlice';
import { currentRoom } from '../sidemenu/sidemenuSlice';
import './messages.css';
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Messages(){

    const messages = useSelector(roomMessages);
    const dispatch = useDispatch();
    const userRoom = useSelector(currentRoom);
    const roomEncryptedMessages = useSelector(encryptedMessages);

    useEffect(() => {
        console.log(userRoom)
        if(Object.entries(userRoom).length){
            dispatch(getEncryptedRoomMessages(userRoom));
        } else {
            dispatch(setRoomMessages({messages: []}))
        }
    }, [userRoom]);

    const decryptMessages = (messageToDecrypt) => {
        if(messageToDecrypt.length){
            const message = aes256.decrypt(process.env.REACT_APP_AES_KEY, messageToDecrypt);
            return message;
        }
    }

    useEffect(() => {
        socket.on('receive-message', newMessage => {
            if(newMessage.status){
                newMessage.message.message = decryptMessages(newMessage.message.message)
                dispatch(newLocalMessage(newMessage.message));
            }
        })
    }, [])

    useEffect(() => {
        if(roomEncryptedMessages.length){
            const decryptedMessages = roomEncryptedMessages.map(e => ({
                ...e,
                message: decryptMessages(e.message)
            }));
            dispatch(setRoomMessages({messages: decryptedMessages}))
        }
    }, [roomEncryptedMessages])

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
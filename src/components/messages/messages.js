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
        if(Object.keys(userRoom).length){
            dispatch(setRoomMessages({messages: []}))            
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
        } else {

        }
    }, [roomEncryptedMessages])

    return (
        <div className="messages-container">
            <div className="room-messages">
                {
                    messages.map((e,i) => (
                        <div className="message-container" key={`message-${i}`}>
                            <div className="username-container">{e.local_user === false ? <p>{e.username}</p> : ''}</div>
                            <div className={e.local_user ? 'message user-message-local' : 'message user-message-public'} key={i}>
                                {e.message}
                            </div>                            
                        </div>
                    ))
                }                   
            </div>       
        </div>
    )

}

import { useEffect, useState } from 'react'
import './chatbox.css'
import { currentRoom } from '../sidemenu/sidemenuSlice';
import { socket } from '../../features/chatroom/Chatroom';
import aes256 from 'aes256';
import { useSelector } from 'react-redux';
import { newLocalMessage } from '../messages/messageSlice';
import InfoBlock from '../infoblock/infoblock';
import { useDispatch } from 'react-redux';

export default function ChatBox() {

    const [message, setMessage] = useState("");
    const userRoom = useSelector(currentRoom);
    const [roomName, setRoomName] = useState("");
    const [roomId, setRoomId] = useState(0);
    const [messageObject, setMessageObject] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(Object.keys(userRoom).length){
            setRoomName(userRoom.name);
            setRoomId(userRoom.roomId);
            setMessage('');
        } else {
            setRoomName('');
            setRoomId('');
            setMessage('');            
        }
    }, [userRoom]);

    const handleSubmit = (e) => {
        e.preventDefault();
        encryptMessage(message);
    }

    const encryptMessage = (messageToEncrypt) => {
        if(messageToEncrypt.length){
            const encryptMessage = aes256.encrypt(process.env.REACT_APP_AES_KEY, messageToEncrypt);
            setMessageObject({sent: Date(), roomId: roomId, roomName: roomName, message: encryptMessage, decryptedMessage: messageToEncrypt});
        }
    } 

    useEffect(() => {
        if(messageObject.message){
            const decryptedMessage = messageObject.decryptedMessage;
            delete messageObject.decryptedMessage;
            socket.emit("send-message", messageObject, (sent, data ='') => {
                if(sent){
                    console.log(messageObject.message, decryptedMessage)
                    data.message = decryptedMessage;
                    setMessage('');
                    dispatch(newLocalMessage(data));

                } else {
                    if(!sent && data.length){
                        setHasError(true)
                        setErrorMessage(data.message);
                        setTimeout(() => {
                            setHasError(false);
                            setErrorMessage('');
                        }, 3000);
                    }
                }
            })
        }
    }, [messageObject, dispatch])

    return (
        <div className="chat-box-container">
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <input disabled={roomName && roomId ? '' : "disabled"} type="text" placeholder="Enter your message here..." value={message} onChange={(e) => setMessage(e.target.value)}/>
                <input className="send-message" disabled={roomName && roomId ? '' : "disabled"} type="submit" value="Send" />
            </form>
            {
                        (hasError)
                        ?
                        <InfoBlock message={errorMessage} error={hasError} />
                        :
                        ''
            }              
        </div>
    )
}
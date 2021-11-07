import { useEffect } from 'react';
// import { socket } from '../../features/chatroom/Chatroom';
import {verifyUser, userSignedIn} from './chatroomSlice';
import './chatroom.css';
import ChatBox from '../../components/chatbox/chatbox';
import Messages from '../../components/messages/messages';
import SideMenu from '../../components/sidemenu/sidemenu';
import RoomPanel from '../../components/roompanel/roomPanel';
import { useDispatch, useSelector} from 'react-redux';
import { useHistory } from 'react-router';
import socketIOCient from 'socket.io-client';
export const socket = socketIOCient(`${process.env.REACT_APP_API_URL}`, {
    withCredentials: true
  });
socket.connect();
export default function Chatroom(){

    const dispatch = useDispatch();
    const userAuthenticated = useSelector(userSignedIn);
    const history = useHistory();
    
    useEffect(() => {
        dispatch(verifyUser())
    })     

    useEffect(() => {
        if(!userAuthenticated){
            history.push('/register');
        }
    }, [userAuthenticated, history])

    return (
        <div className="chatroom-container">
            <div className="chatroom">
                <div className="side-menu">
                    <SideMenu />
                </div>
                <div className="chat-area">
                    <div className="room-panel">
                        <RoomPanel/>
                    </div>
                    <div className="messages">
                        <Messages />
                    </div>
                    <div className="chat-box">
                        <ChatBox />
                    </div>
                </div>                
            </div>
        </div>
    )

}
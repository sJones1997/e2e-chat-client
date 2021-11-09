import './roomPanel.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons'
import {faHandPointLeft} from '@fortawesome/free-solid-svg-icons'
import {currentRoom} from '../sidemenu/sidemenuSlice';
import { verifyUser } from '../../features/chatroom/chatroomSlice';
import { 
    restorePrompt,
    leaveRoom, 
    userPrompt, 
    userLeft,
    userPromptMessage, 
    getRoom, 
    roomInfo, 
    deleteRoom, 
    erroed, 
    errorMessage, 
    roomDeleted, 
    restoreSuccess,
    updateRoomInfo, 
    signedOut,
    restoreState,
    logout
} 
from './roomPanelSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import InfoBlock from '../infoblock/infoblock';
import { useState } from 'react';
import { socket } from '../../features/chatroom/Chatroom';

export default function RoomPanel(){

    const currentUserRoom = useSelector(currentRoom);
    const currentRoomInfo = useSelector(roomInfo);
    const promptUser = useSelector(userPrompt);
    const promptUserMessage = useSelector(userPromptMessage);
    const hasError = useSelector(erroed);
    const errorMsg = useSelector(errorMessage);
    const deletedRoom = useSelector(roomDeleted);
    const [showPanel, setShowPanel] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const userSignedOut = useSelector(signedOut);
    const userLeftRoom = useSelector(userLeft);
    const [leftName, setLeftName] = useState('');
    const [leftId, setLeftId] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();

    const htmlDecode = (input) => {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes[0].nodeValue;
    }    


    const showMoreOptionsHandle = useCallback((val) => {
        setShowMoreOptions(val);
    }, [])    

    const modalHandle = (val) => {
        setShowModal(val);
    }

    useEffect(() => {
        const overlay = document.querySelector(".overlay"); 
        if(showModal){
            overlay.style.display = 'block';
            showMoreOptionsHandle(false)
            overlay.addEventListener("click", () => {
                dispatch(restorePrompt());
                modalHandle(false);
                overlay.removeEventListener("click", () => {})                  
            }) 
        } else {
            overlay.style.display = 'none';
            modalHandle(false);
            dispatch(restorePrompt())            
        }
    }, [showModal, showMoreOptionsHandle, dispatch])


    const deleteRoomHandle = () => {
        dispatch(verifyUser());
        dispatch(deleteRoom({id: currentRoomInfo.id}))
    }    

    useEffect(() => {
        socket.off('user-joined').on("user-joined", (data) => {
            if(data){
                dispatch(updateRoomInfo({amount: 1}));            
            }
        })
    }, [dispatch]);


    useEffect(() => {
        socket.off('user-left').on('user-left', (data, username) => {          
            dispatch(updateRoomInfo({amount: -1}));  
        })
    }, [dispatch])    

    useEffect(() => {
        if(userLeftRoom){      
            backToSideMenu();               
            socket.emit('user-leaving', leftId, leftName, (name, username) => {
                console.log("USER LEAVING")
            })
        }
    }, [userLeftRoom, leftName, dispatch, leftId]);

    const leaveRoomHandle = () => {
        setLeftName(currentRoomInfo.name);
        setLeftId(currentRoomInfo.id);        
        dispatch(leaveRoom({id: currentRoomInfo.id}));   
    }

    useEffect(() => {
        if(promptUser){
            modalHandle(true);
        } else {
            modalHandle(false);
        }
    }, [promptUser])

    useEffect(() => {
        if(Object.keys(currentUserRoom).length){
            dispatch(verifyUser());
            dispatch(getRoom(currentUserRoom));
            setShowPanel(true);
        } else {
            setShowPanel(false);
        }
    }, [currentUserRoom, dispatch])

    useEffect(() => {
        if(deletedRoom){
            modalHandle(false);
            backToSideMenu();
            dispatch(restoreSuccess());
        }
    }, [deletedRoom, dispatch]);

    useEffect(() => {
        if(userSignedOut){
            dispatch(verifyUser())
            .then(() => {
                dispatch(restoreState())
            })
        }
    }, [userSignedOut, dispatch]);

    const backToSideMenu = () => {
        console.log(window.innerWidth);
        if(window.innerWidth <= 540){
            const sideMenu = document.querySelector('.chatroom-container .chatroom .side-menu');
            const chatArea = document.querySelector('.chatroom-container .chatroom .chat-area');
            const dropDown = document.querySelector('.options-dropdown');
            sideMenu.style.display = 'block'
            chatArea.style.display = dropDown.style.display = 'none'             
        }       
    }

    return (
        <div className="room-panel-container">
            <div className="room-panel">
                {
                    showPanel
                    ?
                    <div className="room-info">
                        <div className="room-name">
                            <h2>{htmlDecode(currentRoomInfo.name)}</h2>
                        </div>        
                        <div onClick={() => {backToSideMenu()}} className="back-to-menu">
                            <span><FontAwesomeIcon icon={faHandPointLeft} /></span>   
                        </div>                        
                        <div className="room-options">
                            <h3>Capacity: {currentRoomInfo.roomCapacity}/{currentRoomInfo.limit}</h3>
                            <button onClick={() => {leaveRoomHandle()}}>Leave room</button>
                        </div>                                  
                    </div>
                    :
                    ''
                }   
                <div className="more-options">
                    <span onClick={() => {showMoreOptionsHandle(!showMoreOptions)}}>
                        <FontAwesomeIcon icon={faEllipsisV} />                                
                    </span>
                    <div className="options-dropdown" style={{"display": showMoreOptions ? 'block' : 'none'}}>
                        <ul>
                            <li className="more-options-mobile">Capacity: {currentRoomInfo.roomCapacity}/{currentRoomInfo.limit}</li>
                            <li onClick={() => {leaveRoomHandle()}} className="more-options-mobile">Leave room</li>                            
                            <li onClick={() => {dispatch(logout())}}>Logout</li>
                        </ul>
                    </div>
                </div>                                                              
            </div>                
                <div className="prompt-modal" style={{"display": showModal ? 'block' : 'none'}}> 
                    <div className="user-message">
                        <h2>{promptUserMessage}</h2>
                    </div>
                    <div className="leave-options">
                        <button className="stay" onClick={() => {modalHandle(false)}}>Stay</button>
                        <button className="leave" onClick={() => {deleteRoomHandle()}}>Leave room</button>
                    </div>
                </div>                            
                {
                    (hasError)
                    ?
                    <InfoBlock message={errorMsg} error={hasError} />
                    :
                    ''
                }                         
        </div>       
    )
}
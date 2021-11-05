import './roomPanel.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons'
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
import { useEffect } from 'react';
import InfoBlock from '../infoblock/infoblock';
import { useState } from 'react';
import { socket } from '../../app/App';

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

    const dispatch = useDispatch();

    const htmlDecode = (input) => {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes[0].nodeValue;
    }    

    const showModal = () => {
        const overlay = document.querySelector(".overlay")
        const modal = document.querySelector(".prompt-modal")
        overlay.style.display = "block";  
        modal.style.display = "flex";
        overlay.addEventListener("click", () => {
            hideModal();
        })
    }

    const hideModal = () => {
        dispatch(restorePrompt());
        const overlay = document.querySelector(".overlay");
        const modal = document.querySelector(".prompt-modal");
        modal.style.display = "none"        
        overlay.style.display = "none";   
        overlay.removeEventListener("click", () => {})
    }    

    const deleteRoomHandle = () => {
        dispatch(verifyUser());
        dispatch(deleteRoom({id: currentRoomInfo.id}))
    }    

    const showMoreOptionsHandle = () => {
        setShowMoreOptions(!showMoreOptions);
    }

    useEffect(() => {
        socket.on("user-joined", (data) => {
            if(data){
                dispatch(updateRoomInfo({amount: 1}));            
            }
        })
    }, [dispatch]);

    useEffect(() => {
        dispatch(verifyUser());
        if(userLeftRoom){           
            socket.emit('user-leaving', leftId, leftName, (name) => {
                console.log(name);
            })
        }
    }, [userLeftRoom, leftName, dispatch, leftId]);

    useEffect(() => {
        socket.on('user-left', data => {
            dispatch(updateRoomInfo({amount: -1}));  
        })
    }, [dispatch])

    const leaveRoomHandle = () => {
        setLeftName(currentRoomInfo.name);
        setLeftId(currentRoomInfo.id);        
        dispatch(leaveRoom({id: currentRoomInfo.id}));   
    }

    useEffect(() => {
        if(promptUser){
            showModal();
        } else {
            hideModal()
        }
    }, [promptUser, showModal, hideModal])

    useEffect(() => {
        if(Object.keys(currentUserRoom).length){
            dispatch(verifyUser());
            dispatch(getRoom(currentUserRoom));
            setShowPanel(true)
        } else {
            setShowPanel(false);
        }
    }, [currentUserRoom, dispatch])

    useEffect(() => {
        if(deletedRoom){
            hideModal();
            dispatch(restoreSuccess());
        }
    }, [deletedRoom, dispatch, hideModal]);

    useEffect(() => {
        if(userSignedOut){
            dispatch(verifyUser())
            .then(() => {
                dispatch(restoreState())
            })
        }
    }, [userSignedOut, dispatch])

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
                        <div className="room-options">
                            <h3>Capacity: {currentRoomInfo.roomCapacity}/{currentRoomInfo.limit}</h3>
                            <button onClick={() => {leaveRoomHandle()}}>Leave room</button>
                        </div>                                  
                    </div>
                    :
                    ''
                }   
                <div className="more-options">
                    <span onClick={() => {showMoreOptionsHandle()}}>
                        <FontAwesomeIcon icon={faEllipsisV} />                                
                    </span>
                    <div className="options-dropdown" style={{"display": showMoreOptions ? 'block' : 'none'}}>
                        <ul>
                            <li onClick={() => {dispatch(logout())}}>Logout</li>
                        </ul>
                    </div>
                </div>                                                              
            </div>                
                <div className="prompt-modal"> 
                    <div className="user-message">
                        <h2>{promptUserMessage}</h2>
                    </div>
                    <div className="leave-options">
                        <button className="stay" onClick={() => {hideModal()}}>Stay</button>
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
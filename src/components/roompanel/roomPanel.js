import './roomPanel.css';
import {currentRoom} from '../sidemenu/sidemenuSlice';
import { 
    restorePrompt,
    leaveRoom, 
    userPrompt, 
    userPromptMessage, 
    getRoom, 
    roomInfo, 
    deleteRoom, 
    erroed, 
    errorMessage, 
    roomDeleted, 
    successMessage,
    restoreSuccess } 
from './roomPanelSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import InfoBlock from '../infoblock/infoblock';
import { useState } from 'react';

export default function RoomPanel(){

    const currentUserRoom = useSelector(currentRoom);
    const currentRoomInfo = useSelector(roomInfo);
    const promptUser = useSelector(userPrompt);
    const promptUserMessage = useSelector(userPromptMessage);
    const hasError = useSelector(erroed);
    const errorMsg = useSelector(errorMessage);
    const deletedRoom = useSelector(roomDeleted);
    const [showPanel, setShowPanel] = useState(false);

    const dispatch = useDispatch();

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
        dispatch(deleteRoom({id: currentRoomInfo.id}))
    }    

    const leaveRoomHandle = () => {
        dispatch(leaveRoom({id: currentRoomInfo.id}))   
        .then(() => {
            const rooms = document.querySelectorAll(".room");
            if(rooms.length > 1){
                document.querySelector(".selected").classList.remove("selected");
                rooms[1].classList.add("selected");
            }            
        })
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
            dispatch(getRoom({id: currentUserRoom.roomId}));
            setShowPanel(true)
        } else {
            setShowPanel(false);
        }
    }, [currentUserRoom]);

    useEffect(() => {
        if(deletedRoom){
            hideModal();
            dispatch(restoreSuccess());
        }
    }, [deletedRoom])

    return (
        <div className="room-panel-container">
                {
                    showPanel
                    ?
                    <div className="room-panel">
                        <div className="room-name">
                            <h2>Room name: {currentRoomInfo.name}</h2>
                        </div>        
                        <div className="room-options">
                            <h3>Current capacity: {currentRoomInfo.roomCapacity}/{currentRoomInfo.limit}</h3>
                            <button onClick={() => {leaveRoomHandle()}}>Leave room</button>
                        </div>                        
                    </div>     
                    :
                    ''               
                }    
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
import { useEffect, useState } from 'react';
import './roomPanel.css';
import {currentRoom} from '../sidemenu/sidemenuSlice';
import { restorePrompt } from './roomPanelSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


export default function RoomPanel(){

    const currentUserRoom = useSelector(currentRoom);

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
        const overlay = document.querySelector(".overlay");
        const modal = document.querySelector(".prompt-modal");
        modal.style.display = "none"        
        overlay.style.display = "none";   
        dispatch(restorePrompt());
        overlay.removeEventListener("click", () => {})
    }    

    return (
        <div className="room-panel-container">
            <div className="room-panel">
                <div className="room-name">
                    <h2>Room name: {currentUserRoom.name}</h2>
                </div>        
                <div className="room-options">
                    <h3>Current capacity: {currentUserRoom.roomCapacity}/{currentUserRoom.limit}</h3>
                    <button>Leave room</button>
                </div>  
                <div className="prompt-modal"> 
                    <div className="user-message">
                        <h2></h2>
                    </div>
                    <div className="leave-options">
                        <button className="stay">Stay</button>
                        <button className="leave">Leave room</button>
                    </div>
                </div>              
            </div>             
        </div>       
    )
}
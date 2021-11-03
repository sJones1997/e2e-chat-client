import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyUser } from '../../features/chatroom/chatroomSlice';
import { 
    createNewRoom, 
    errorMessage, 
    errored, 
    resetErrorStatus 
} from './addroomSlice';
import './addroom.css';
import { useSelector } from 'react-redux';
import InfoBlock from '../infoblock/infoblock';

export default function AddRoom(){

    const [newRoomName, setNewRoomName] = useState("");
    const [newRoomLimit, setNewRoomLimit] = useState(2);

    const dispatch = useDispatch();

    const hasError = useSelector(errored);
    const errorMsg = useSelector(errorMessage);

    const hideModal = () => {
        const overlay = document.querySelector(".overlay");
        const modal = document.querySelector(".modal");        
        overlay.style.display = "none";
        modal.style.display = "none";         
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(verifyUser());
        dispatch(createNewRoom({newRoomName: newRoomName, newRoomLimit: newRoomLimit}));
        hideModal()
    }

    const resetErrorMessage = () => {
        setTimeout(() => {
            dispatch(resetErrorStatus());
        }, 5000)
    }

    return (
        <div className="add-room-container">
            <div className="modal">
                <div className="add-room-header">
                    <h2>Create a new room</h2>         
                    <h3 onClick={hideModal}>X</h3>       
                </div>
                <div className="add-room-body">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="room-details">
                            <input type="text" placeholder="Room name" min="3" max="25" value={newRoomName} onChange={(e) => {setNewRoomName(e.target.value)}} />
                            <input type="number" placeholder="Max members (2 - 8)" min="2" max="8" value={newRoomLimit} onChange={(e) => {setNewRoomLimit(e.target.value)}} />
                        </div>
                        <div>
                            <input type="submit" />                        
                        </div>
                    </form>                
                </div>
            </div>
            <div>
            {
                (hasError)
                ?
                <div>
                    <InfoBlock message={errorMsg} error={hasError} />       
                    {resetErrorMessage()}             
                </div>
                :
                ''
            }             
            </div>         
        </div>
    )

}
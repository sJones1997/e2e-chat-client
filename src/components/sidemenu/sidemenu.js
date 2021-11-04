import './sidemenu.css';
import { verifyUser } from '../../features/chatroom/chatroomSlice';
import SearchBar from '../searchbar/searchbar';
import AddRoom from '../addroom/addroom';
import { 
    getUserRooms, 
    userRooms, 
    errored, 
    errorMessage, 
    loading, 
    setError, 
    resetError, 
    setCurrentRoom,
    currentRoom 
} from './sidemenuSlice';
import { userLeft, roomDeleted, restoreUserRoom } from '../roompanel/roomPanelSlice';
import { userJoinedNewRoom, restoreUserJoined } from '../searchbar/searchbarSlice';
import { newRoom } from '../addroom/addroomSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import InfoBlock from '../infoblock/infoblock';
import { socket } from '../../app/App';
import { useState } from 'react';

export default function SideMenu(){

    const dispatch = useDispatch();

    const rooms = useSelector(userRooms);
    const hasError = useSelector(errored);
    const errorMsg = useSelector(errorMessage);
    const isLoading = useSelector(loading);
    const roomToAdd = useSelector(newRoom);
    const deletedRoom = useSelector(roomDeleted);
    const userLeftRoom = useSelector(userLeft);
    const userJoined = useSelector(userJoinedNewRoom);
    const currentUserRoom = useSelector(currentRoom);
    const [moveRoom, setMoveRoom] = useState({});

    const handleModal = () => {
        const overlay = document.querySelector(".overlay");
        const modal = document.querySelector(".modal");
        if((!overlay.style.display || overlay.style.display === "none") && (!modal.style.display || modal.style.display === "none")){
            overlay.style.display = "block";
            modal.style.display = "flex";
            overlay.addEventListener("click", () => {
                overlay.style.display = "none";
                modal.style.display = "none";                
            })
        }
    }
    
    useEffect(() => {
        dispatch(verifyUser())        
        dispatch(getUserRooms());  
    },[dispatch])    

    useEffect(() => {
        if(rooms.length){
            setMoveRoom(rooms[0])
        } else {
            dispatch(setCurrentRoom({}));            
        }
    }, [rooms, dispatch]);

    useEffect(() => {
        if(Object.entries(moveRoom).length){
            dispatch(verifyUser())            
            socket.emit("move-room", moveRoom.name, moveRoom.roomId, (connected, message) => {
                if(connected){
                    dispatch(setCurrentRoom(moveRoom));
                }
            })
        }
    }, [moveRoom, dispatch]);

    useEffect(() => {
        if(userLeftRoom){
            dispatch(getUserRooms()); 
            dispatch(restoreUserRoom());   
        }
    }, [userLeftRoom, dispatch]);

    useEffect(() => {
        if(Object.entries(currentUserRoom).length){
            const selected = document.querySelector(".selected")
            if(selected){
                document.querySelector(".selected").classList.remove('selected');
            } 
            document.querySelector(`#room-${currentUserRoom.roomId}-${currentUserRoom.name}`).classList.add('selected');
        }
    }, [currentUserRoom]);
    
    
    useEffect(() => {
        if(roomToAdd){
            dispatch(verifyUser())
            .then(() => {
                dispatch(getUserRooms());
            })
        }
    }, [roomToAdd, dispatch]);

    useEffect(() => {
        if(deletedRoom){
            dispatch(verifyUser())
            .then(() => {
                dispatch(getUserRooms());                
            })
        }
    }, [deletedRoom, dispatch]);

    useEffect(() => {
        if(userJoined){
            dispatch(verifyUser())
            .then(() => {
                dispatch(getUserRooms());
                dispatch(restoreUserJoined());
            })
        }
    }, [userJoined, dispatch]);       
 
    return (
        <div className="side-menu-container">
            <div className="search-bar">
                <SearchBar />
            </div>
            <div className="current-chats">
                <div className="add-room" onClick={handleModal}>
                    <h3>Create a new room</h3>
                </div>
                {
                    !(hasError && isLoading)
                    ?
                    rooms.map((e,i) => (
                        <div className={i === 0 ? 'room selected' : 'room'} id={`room-${e.roomId}-${e.name}`} key={i} onClick={() => {setMoveRoom({roomId: e.roomId, name: e.name})}}>
                            <h3>{e.name}</h3>
                        </div>
                    ))
                    :
                    ''
                }
            </div>
            <AddRoom/>
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
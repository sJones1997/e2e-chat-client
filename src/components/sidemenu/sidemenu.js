import './sidemenu.css';
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
    setCurrentRoom 
} from './sidemenuSlice';
import { userLeft, roomDeleted, restoreUserRoom } from '../roompanel/roomPanelSlice';
import { userJoinedNewRoom, restoreUserJoined } from '../searchbar/searchbarSlice';
import { newRoom } from '../addroom/addroomSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import InfoBlock from '../infoblock/infoblock';
import { socket } from '../../app/App';
import { currentUserRoom } from '../chatbox/chatboxSlice';

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

    const moveRoom = (newRoom, roomId) => {
        socket.emit("move-room", newRoom, roomId, (connected, message) => {
            if(connected){
                const currentRoom = rooms.filter(e => {return e.roomId === parseInt(roomId)})
                dispatch(setCurrentRoom(currentRoom[0]));       
                document.querySelector('.selected').classList.remove("selected");
                document.querySelector(`#room-${roomId}-${newRoom}`).classList.add("selected"); 
            } else {
                dispatch(setError({'message': message}));
                setTimeout(() => {
                    dispatch(resetError())
                }, 5000);
            }                   
        });
    }

    useEffect(() => {
        if(roomToAdd){
            dispatch(getUserRooms());
        }
    }, [roomToAdd, dispatch]);

    useEffect(() => {
        if(deletedRoom){
            dispatch(getUserRooms());
        }
    }, [deletedRoom, dispatch]);

    useEffect(() => {
        if(userJoined){
            dispatch(getUserRooms());
            dispatch(restoreUserJoined());
        }
    }, [userJoined, dispatch]);

    useEffect(() => {
        if(userLeftRoom){
            console.log(userLeftRoom);
            dispatch(getUserRooms()); 
            dispatch(restoreUserRoom());                   
            const rooms = document.querySelectorAll('.room');
            if(rooms.length > 1){
                let id = rooms[0].getAttribute('id');
                id = id.split("-");
                const roomId = id[1];
                const roomName = id[2];
                moveRoom(roomName, roomId)                   
            } else {
                dispatch(setCurrentRoom({}));
            }
        }
    }, [userLeftRoom, moveRoom, dispatch])    

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
                        <div className={i === 0 ? 'room selected' : 'room'} id={`room-${e.roomId}-${e.name}`} key={i} onClick={() => {moveRoom(e.name, e.roomId)}}>
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
import './sidemenu.css';
import SearchBar from '../searchbar/searchbar';
import AddRoom from '../addroom/addroom';
import { getUserRooms, userRooms, errored, errorMessage, loading, setError, resetError, setCurrentRoom } from './sidemenuSlice';
import { userLeft, roomDeleted } from '../roompanel/roomPanelSlice';
import { newRoom } from '../addroom/addroomSlice';
import { userJoinedNewRoom } from '../searchbar/searchbarSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import InfoBlock from '../infoblock/infoblock';
import { socket } from '../../app/App';

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

    useEffect(() => {
        if(roomToAdd || deletedRoom || userLeftRoom || userJoined){
            dispatch(getUserRooms());
        }
    }, [roomToAdd, dispatch, deletedRoom, userLeftRoom, userJoined]);

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
                const currentRoom = rooms.filter(e => {return e.roomId === roomId})
                dispatch(setCurrentRoom(currentRoom[0]));       
                document.querySelector('.selected').classList.remove("selected");
                document.querySelector(`#room-${roomId}`).classList.add("selected");  
            } else {
                dispatch(setError({'message': message}));
                setTimeout(() => {
                    dispatch(resetError())
                }, 5000);
            }                   
        });
    }

    return (
        <div className="side-menu-container">
            <div className="search-bar">
                <SearchBar />
            </div>
            <div className="current-chats">
                <div className="add-room room" onClick={handleModal}>
                    <h3>Create a new room</h3>
                </div>
                {
                    !(hasError && isLoading)
                    ?
                    rooms.map((e,i) => (
                        <div className={i === 0 ? 'room selected' : 'room'} id={`room-${e.roomId}`} key={i} onClick={() => {moveRoom(e.name, e.roomId)}}>
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
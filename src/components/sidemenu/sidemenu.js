import './sidemenu.css';
import SearchBar from '../searchbar/searchbar';
import AddRoom from '../addroom/addroom';
import { getUserRooms, userRooms, errored, errorMessage, loading } from './sidemenuSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import InfoBlock from '../infoblock/infoblock';

export default function SideMenu(){

    const dispatch = useDispatch();

    const rooms = useSelector(userRooms);
    const hasError = useSelector(errored);
    const errorMsg = useSelector(errorMessage);
    const isLoading = useSelector(loading);

    useEffect(() => {
        dispatch(getUserRooms());
    }, [dispatch])

    const handleModal = () => {
        const overlay = document.querySelector(".overlay");
        const modal = document.querySelector(".add-room-container");
        console.log(overlay.style.display, modal.style.display)
        if((!overlay.style.display || overlay.style.display === "none") && (!modal.style.display || modal.style.display === "none")){
            overlay.style.display = "block";
            modal.style.display = "flex";
            overlay.addEventListener("click", () => {
                overlay.style.display = "none";
                modal.style.display = "none";                
            })
        }
    }

    return (
        <div className="side-menu-container">
            <div className="search-bar">
                <SearchBar />
            </div>
            <div className="current-chats">
                <div className="new-room" onClick={handleModal}>
                    <h3>Create a new room</h3>
                </div>
                {
                    !(hasError && isLoading)
                    ?
                    rooms.map((e,i) => (
                        <div className="new-room" key={i}>
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
import {socket} from '../../app/App';
import { verifyUser } from '../../features/chatroom/chatroomSlice';
import {
    updateSearchResult, 
    roomSearchResults, 
    hasRoomResult, 
    restoreResults, 
    userJoinedRoom,
    userFeedBack,
    userMessage,
    error
} from './searchbarSlice';
import './searchbar.css'
import InfoBlock from '../infoblock/infoblock';
import { useDispatch, useSelector } from 'react-redux';


export default function SearchBar(){

    const dispatch = useDispatch();
    const roomResults = useSelector(roomSearchResults);
    const roomHasResults = useSelector(hasRoomResult);
    const hasError = useSelector(error);
    const errorMsg = useSelector(userMessage);

    const handleSearch = (e) => {
        dispatch(verifyUser());
        const searchTerm = e.target.value;
        if(searchTerm.length){
            socket.emit("search", searchTerm, (result) => {
                if(result){
                    dispatch(updateSearchResult({result: result}));
                }
            })
        } else {
            dispatch(restoreResults())
        }
    }

    const connectToRoom = (roomId, alreadyJoined) => {
        dispatch(verifyUser());
        if(!alreadyJoined){
            socket.emit('join-room', roomId, (message, status) =>{
                if(status){
                    dispatch(userJoinedRoom());
                    document.querySelector('#search-term').value = '';
                } else {
                    dispatch(userFeedBack({message: message}));
                }
            })
        }
    }

    return (
        <div className="search-bar-container">
            <input type="text" id="search-term" placeholder="Search for existing rooms" onChange={(e) => {handleSearch(e)}}/>
            <div className="search-container" style={{'display' :(roomHasResults) ? 'block' : 'none'}}>
                {
                    (roomHasResults)
                    ?
                    <div className="results">
                        {
                            roomHasResults
                            ?
                            <div className="room-results-container">
                                <div className="results-header">
                                    <h2>Rooms:</h2>
                                </div>
                                <div className="room-results">
                                { roomResults.map((e, i) => {
                                    return <div className={e.alreadyJoined ? 'joined room-result result' : 'room-result result'} key={`room-${i}`} onClick={() => {connectToRoom(e.id, e.alreadyJoined)}}>
                                        <p>{e.name}</p>
                                    </div>
                                })}                                    
                                </div>
                            </div>
                            :
                            <div className="room-results-container">
                                <div className="results-header">
                                    <h2>Rooms:</h2>
                                </div>
                                <div className="no-room-result result">
                                    <p>{roomResults[0]}</p>                               
                                </div>
                            </div>                            
                }
                    </div>
                    :
                    ''                    
                }             
            </div>          
            <div className="error-component">
            {
                    (hasError)
                    ?
                    <InfoBlock message={errorMsg} error={hasError} />
                    :
                    ''
            }                       
            </div>
        </div>
    )
}
import {socket} from '../../app/App';
import {
    updateSearchResult, 
    userSearchResults, 
    roomSearchResults, 
    hasUserResult, 
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
    const userResults = useSelector(userSearchResults);
    const userHasResult = useSelector(hasUserResult);
    const roomResults = useSelector(roomSearchResults);
    const roomHasResults = useSelector(hasRoomResult);
    const hasError = useSelector(error);
    const errorMsg = useSelector(userMessage);

    const handleSearch = (e) => {
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

    const connectToUser = (username) => {
        console.log(username);
    }

    const connectToRoom = (roomId, alreadyJoined) => {
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
            <input type="text" id="search-term" placeholder="Search for existing rooms or other users" onChange={(e) => {handleSearch(e)}}/>
            <div className="search-container" style={{'display' :(userHasResult || roomHasResults) ? 'block' : 'none'}}>
                {
                    (userHasResult || roomHasResults)
                    ?
                    <div className="results">
                        {
                            userHasResult
                            ?
                            <div className="user-results-container">
                                <div className="results-header">
                                    <h2>Users:</h2>
                                </div>
                                <div className="user-results">
                                    { userResults.map((e,i) => {
                                    return (
                                        <div className="user-result result" key={`user-${i}`} onClick={() => {connectToUser(e.username)}}>
                                            <p>{e.username}</p>
                                        </div>)
                                    })  }                                
                                </div>                             
                            </div>
                            :
                            <div className="user-results-container">
                                <div className="results-header">
                                    <h2>Users:</h2>
                                </div>
                                <div className="no-user-result result">
                                    <p>{userResults[0]}</p>                   
                                </div>                             
                            </div>                            
                        }
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
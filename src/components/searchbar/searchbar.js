import {socket} from '../../app/App';
import { verifyUser } from '../../features/chatroom/chatroomSlice';
import {
    updateSearchResult, 
    roomSearchResults, 
    hasRoomResult, 
    restoreResults, 
    userJoinedRoom,
    userFeedBack,
    error,
    errorMessage,
    restoreFeedBack
} from './searchbarSlice';
import './searchbar.css'
import InfoBlock from '../infoblock/infoblock';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


export default function SearchBar(){

    const dispatch = useDispatch();
    const roomResults = useSelector(roomSearchResults);
    const roomHasResults = useSelector(hasRoomResult);
    const hasError = useSelector(error);
    const errorMsg = useSelector(errorMessage);
    const [searchTerm, setSearchTerm] = useState('');
    const [roomToJoin, setRoomToJoin] = useState({});

    useEffect(() => {
        dispatch(verifyUser());
        if(searchTerm.length){
            socket.emit("search", searchTerm, (result) => {
                if(result){
                    dispatch(updateSearchResult({result: result}));
                }
            })
        } else {
            dispatch(restoreResults())
        }
    }, [searchTerm, dispatch]);

    useEffect(() => {
        if(Object.keys(roomToJoin).length){
            dispatch(verifyUser());
            if(!roomToJoin.joined){
                socket.emit('join-room', roomToJoin.roomId, (message, status) =>{
                    if(status){
                        dispatch(userJoinedRoom());
                    } else {
                        dispatch(userFeedBack({message: message}));
                        setTimeout(() => {
                            dispatch(restoreFeedBack())
                        }, 3000);

                    }
                    setSearchTerm('');                    
                })
            }
        }
    }, [roomToJoin, dispatch])



    return (
        <div className="search-container">
            <div className="search-bar-container">
                <input type="text" id="search-term" autoComplete='off' value={searchTerm} placeholder="Search for existing rooms" onChange={(e) => {setSearchTerm(e.target.value)}}/>  
                <div className="search-results" style={{'display': searchTerm.length ? 'block' : 'none'}}>
                    {
                        (searchTerm.length)
                        ?
                        <div className="results">
                            {
                                (roomHasResults)
                                ?   
                                <div className="room-results-container">
                                    <div className="results-header">
                                        <h2>Rooms:</h2>
                                    </div>
                                    <div className="room-results">
                                        {
                                            roomResults.map((e,i) => (
                                            <div className={e.alreadyJoined ? 'joined room-result result' : 'room-result result'} key={`room-${i}`} onClick={() => {setRoomToJoin({roomId: e.id, joined: e.alreadyJoined})}}>
                                                <p>{e.name}</p>
                                            </div>                                        
                                            ))
                                        }
                                    </div>
                                </div>                                                      
                                :
                                <div className="no-results">
                                    <h2>No results to show</h2>
                                </div>
                            }
                        </div>
                        :
                        ''               
                    
                    }
                </div>              
            </div>
            <div>
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
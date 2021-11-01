import {useEffect, useState} from 'react';
import {socket} from '../../app/App';
import {updateSearchResult, searchResults} from './searchbarSlice';
import './searchbar.css'
import { useDispatch, useSelector } from 'react-redux';


export default function SearchBar(){

    const dispatch = useDispatch();
    const allSearchResults = useSelector(searchResults);
    const [roomResults, setRoomsResults] = useState([]);
    const [userResults, setUserResults] = useState('');

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        if(searchTerm.length){
            socket.emit("search", searchTerm, (result) => {
                if(result){
                    dispatch(updateSearchResult({result: result}));
                }
            })
        }
    };

    useEffect(() => {
        if(Object.keys(allSearchResults).length){
            const keys = Object.keys(allSearchResults.result);
            console.log(keys);
            let roomResults;
            let userResults;
            for(let i = 0; i < keys.length; i ++){
                if(keys[i] === "rooms"){
                    if(typeof(allSearchResults.result[keys[i]].message) === 'string'){
                        roomResults = [{name: allSearchResults.result[keys[i]].message}];
                    }
                    roomResults = allSearchResults.result[keys[i]].message;
                }
            }
            console.log(roomResults);
            setRoomsResults(roomResults);
        }
    }, [allSearchResults]);

    return (
        <div className="search-bar-container">
            <input type="text" placeholder="Search for existing rooms or other users" onChange={(e) => {handleSearch(e)}}/>
            <div>
                {
                    roomResults.length
                    ?
                    roomResults.map((e,i) => (
                        
                           <div className="room-result" key={i}>
                               {e.name}
                           </div>
                        
                    ))
                    :
                    ''
                }
            </div>
        </div>
    )
}
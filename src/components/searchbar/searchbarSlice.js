import { createSlice } from "@reduxjs/toolkit";

const searchBarSlice = createSlice({
    name: 'searchBarSlice',
    initialState: {
        roomSearchResults: [],
        roomSearchHasResult: false,
        userJoinedNewRoom: false,
        joinFeedBack: '',
        hasError: false
    },
    reducers: {
        updateSearchResult: (state, action) => {
            if(!action.payload.result.rooms.status){
                state.roomSearchHasResult = false;
                state.roomSearchResults = [action.payload.result.rooms.message];                
            } else {
                state.roomSearchHasResult = true;
                state.roomSearchResults = action.payload.result.rooms.message;                
            }          
        },
        restoreResults: (state) => {
            state.roomSearchHasResult = false;
            state.roomSearchResults = [];         
            state.userSearchHasResult = false;
            state.userSearchResults = [];                    
        },
        userJoinedRoom: (state) => {
            state.userJoinedNewRoom = true;
            state.userSearchHasResult = false;
            state.roomSearchHasResult = false;
            state.roomSearchResults = [];      
            state.userSearchResults = [];              
        },
        restoreUserJoined: (state) => {
            state.userJoinedNewRoom = false;
        },
        userFeedBack: (state, action) => {
            state.hasError = true;
            state.userFeedBack = action.payload.message;
        }
    }
});

export const {updateSearchResult, restoreResults, userJoinedRoom, userFeedBack, restoreUserJoined} = searchBarSlice.actions;
export const hasRoomResult = state => state.searchBarSlice.roomSearchHasResult;
export const hasUserResult = state => state.searchBarSlice.userSearchHasResult;
export const userSearchResults = state => state.searchBarSlice.userSearchResults;
export const roomSearchResults = state => state.searchBarSlice.roomSearchResults;
export const userJoinedNewRoom = state => state.searchBarSlice.userJoinedNewRoom;
export const userMessage = state => state.searchBarSlice.joinFeedBack;
export const error = state => state.searchBarSlice.hasError;
export default searchBarSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";
import { currentUserRoom } from "../chatbox/chatboxSlice";

export const getUserRooms = createAsyncThunk(
    'sideMenuSlice/getUserRooms',
    async () => {
        const data = await fetch(`${baseApi}/user-rooms`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        });
        const {status} = data;
        const json = await data.json();
        json['status'] = status;
        return json;
    }
)

const sideMenuSlice = createSlice({
    name: 'sideMenuSlice',    
    initialState: {
        isLoading: false,
        hasError: false,
        userRooms: [],
        currentRoom: {},
        errorMessage: ''    
    },
    reducers: {
        setError: (state, action) => {
            state.hasError = true;
            state.errorMessage = action.payload.message;
        },
        resetError: (state) => {
            state.hasError = false;
            state.errorMessage = '';
        },
        setCurrentRoom: (state, action) =>{
            state.currentRoom = action.payload;
            console.log(state.currentRoom)
        }
    },
    extraReducers: {
        [getUserRooms.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [getUserRooms.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                if(!(action.payload.message.length === 1 && action.payload.message[0].roomId === null)){
                    state.userRooms = action.payload.message;
                    state.currentRoom = state.userRooms[0];
                }
            } else {
                state.hasError = true;
            }
        },
        [getUserRooms.rejected]: (state, action) => {
            state.hasError = true;
            state.errorMessage = action.payload.message;
        }            
    }
})


export const loading = state => state.sideMenuSlice.isLoading;
export const errored = state => state.sideMenuSlice.hasError;
export const errorMessage = state => state.sideMenuSlice.errorMessage;
export const userRooms = state => state.sideMenuSlice.userRooms;
export const currentRoom = state => state.sideMenuSlice.currentRoom;
export const {setError, resetError, getTopRoom, setCurrentRoom} = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
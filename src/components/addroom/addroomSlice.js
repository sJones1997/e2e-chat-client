import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";


export const createNewRoom = createAsyncThunk(
    'addRoomSlice/createNewRoom',
    async (obj) => {
        const {newRoomName, newRoomLimit} = obj;

        const data = await fetch(`${baseApi}/room`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'                  
            },
            body: JSON.stringify({newRoomName: newRoomName,newRoomLimit: newRoomLimit})
        });
        const {status} = data;
        const json = await data.json();
        json['status'] = status;
        console.log(json)
        return json;
    }
)

const addRoomSlice = createSlice({
    name:'addRoomSlice',
    initialState: {
        isLoading: false,
        hasError: false,
        errorMessage: '',
        newRoom: {}
    },
    extraReducers: {
        [createNewRoom.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [createNewRoom.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.hasError = false;
            if(action.payload.status === 200){
                state.errorMessage = '';
                state.newRoom = action.payload.newRoom; 
            } else {
                state.hasError = false;
                state.errorMessage = action.payload.message;
            }
        },
        [createNewRoom.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const errored = state => state.addRoomSlice.hasError;
export const errorMessage = state => state.addRoomSlice.errorMessage;

export default addRoomSlice.reducer;
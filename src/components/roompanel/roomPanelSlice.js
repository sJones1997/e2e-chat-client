import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";

export const getRoom = createAsyncThunk(
    'roomPanelSlice/getRoom',
    async (obj) => {
        const {id} = obj
        const data = await fetch(`${baseApi}/room/${id}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        })
        const {status} = data;
        const json = await data.json();
        json['status'] = status;
        return json;
    }
)

export const leaveRoom = createAsyncThunk(
    'roomPanelSlice/leaveRoom', 
    async (obj) => {
        const {id} = obj;
        const data = await fetch(`${baseApi}/user-rooms/${id}`, {
            method:'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const {status} = data;
        const json = await data.json();
        json['status'] = status;
        return json;
    }
)

const roomPanelSlice = createSlice({
    name:'roomPanelSlice',
    initialState: {
        hasError: false,
        isLoading: false,
        roomInfo: {},
        userLeft: {},
        userPrompt: false,
        userPromptMessage: ''           
    },
    reducers: {
        restorePrompt: (state) => {
        }
    },    
    extraReducers: {
        [getRoom.pending]: (state, action) => {
            state.hasError = false;
            state.isLoading = true;
    
        },
        [getRoom.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                state.hasError = false;
                state.roomInfo = action.payload.message;
            } else {
                state.hasError = true;
                state.errorMessage = action.payload.message;
            }
        }, 
        [getRoom.rejected]: (state, action) => {
            state.hasError = false;
        },  
        [leaveRoom.pending]: (state, action) => {
            state.hasError = false;
            state.isLoading = true;
        },
        [leaveRoom.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                if(action.payload.prompt){
                    state.userPrompt =  true;
                    state.userPromptMessage = action.payload.prompt.message;
                    return;
                }
                state.successMessage = action.payload.message
                state.userLeft = true;
            }
        },
        [leaveRoom.rejected]: (state, action) => {
            state.hasError = true;
            state.isLoading = false;
        }           
    }    
})

export const roomInfo = state => state.roomPanelSlice.roomInfo; 
export const userPrompt = state => state.roomPanelSlice.userPrompt;
export const userPromptMessage = state => state.roomPanelSlice.userPromptMessage;
export const userLeft = state => state.roomPanelSlice.userLeft;
export const {restorePrompt} = roomPanelSlice.actions;
export default roomPanelSlice.reducer;
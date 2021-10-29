import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";


export const getRoomInfo = createAsyncThunk(
    'messageSlice/getRoomInfo',
    async (obj) => {
        const {id} = obj
        const data = await fetch(`${baseApi}/room/capacity/${id}`, {
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
    'messageSlice/leaveRoom', 
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


const messageSlice = createSlice({
    name:'messageSlice',
    initialState:{
        hasError:false,
        isLoading: false,
        messages: [],
        roomInfo: {},
        errorMessage: '',
        userPrompt: false,
        userPromptMessage: '',
        successMessage: ''
    },
    extraReducers: {
        [getRoomInfo.pending]: (state, action) => {
            state.hasError = false;
            state.isLoading = true;

        },
        [getRoomInfo.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                state.hasError = false;
                state.roomInfo = action.payload.message;
                console.log(state.roomInfo);
            } else {
                state.hasError = true;
                state.errorMessage = action.payload.message;
            }
        }, 
        [getRoomInfo.rejected]: (state, action) => {
            state.hasError = false;
        },
        [leaveRoom.pending]: (state, action) => {
            state.hasError = false;
            state.isLoading = true;
        },
        [leaveRoom.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                if(!action.payload.prompt.status){
                    state.userPrompt =  true;
                    state.userPromptMessage = action.payload.prompt.message;
                    return;
                }
                state.successMessage = action.payload.message
            }
        },
        [leaveRoom.rejected]: (state, action) => {
            state.hasError = true;
            state.isLoading = false;
        }
    }
})

export const roomInfo = state => state.messageSlice.roomInfo; 
export const userPrompt = state => state.messageSlice.userPrompt;
export const userPromptMessage = state => state.messageSlice.userPromptMessage;
export default messageSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";

export const getEncryptedRoomMessages = createAsyncThunk(
    'messageSlice/roomMessages',
    async (obj) => {
        const {roomId} = obj
        const data = await fetch(`${baseApi}/messages/${roomId}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const {status} = data;
        const json = await data.json();
        json['status'] = status;
        return json;
    }
)

const messageSlice = createSlice({
    name:'messageSlice',
    initialState:{
        messages: [],
        encryptedMessages: [],
        errorMessage: '',
        successMessage: '',     
        isLoading: false,
        hasError: false,
        noMessages: false    
    },
    reducers: {
        newLocalMessage: (state, action) => {
            state.messages.unshift(action.payload);
        },
        setRoomMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
        userNotication: (state, action) => {
            state.messages.unshift(action.payload);
        }
    },
    extraReducers: {
        [getEncryptedRoomMessages.pending]: (state) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [getEncryptedRoomMessages.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200 || action.payload.status === 204){
                if(action.payload.status === 204){
                    state.noMessages = true;
                    return;
                }
                state.noMessages = false;
                state.encryptedMessages = action.payload.message;
            }
        },
        [getEncryptedRoomMessages.rejected]: (state, action) => {
            state.hasError = true;
        }
    }
})

export const roomMessages = state => state.messageSlice.messages;
export const encryptedMessages = state => state.messageSlice.encryptedMessages;
export const {newLocalMessage, setRoomMessages, userNotication} = messageSlice.actions;
export default messageSlice.reducer;
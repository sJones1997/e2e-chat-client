import { faRProject } from "@fortawesome/free-brands-svg-icons";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";

const getRoomMessages = createAsyncThunk(
    'messageSlice/roomMessages',
    async (obj) => {
        const {roomId} = obj
        const data = await fetch(`${baseApi}/api/get-messages/${roomId}`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const {status} = data;
        const json = await data.json();
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
    },
    reducers: {
        newLocalMessage: (state, action) => {
            console.log(action.payload);
            state.messages.unshift(action.payload);
        }
    },
    extraReducers: {

    }
})

export const roomMessages = state => state.messageSlice.messages;
export const {newLocalMessage} = messageSlice.actions;
export default messageSlice.reducer;
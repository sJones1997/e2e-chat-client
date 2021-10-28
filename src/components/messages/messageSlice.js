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


const messageSlice = createSlice({
    name:'messageSlice',
    initialState:{
        hasError:false,
        isLoading: false,
        messages: [],
        roomInfo: {},
        errorMessage: ''
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
        }
    }
})

export const roomInfo = state => state.messageSlice.roomInfo; 
export default messageSlice.reducer;
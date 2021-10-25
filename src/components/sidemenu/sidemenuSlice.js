import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";

export const getUserRooms = createAsyncThunk(
    'sideMenuSlice/getUserRooms',
    async () => {
        const data = await fetch(`${baseApi}/user-rooms`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'applicaiton/json',
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
        errorMessage: ''
    },
    extraReducers: {
        [getUserRooms.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [getUserRooms.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                state.userRooms = action.payload.message;
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

export default sideMenuSlice.reducer;
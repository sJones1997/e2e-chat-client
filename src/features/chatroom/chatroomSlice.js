import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";

export const verifyUser = createAsyncThunk(
    'chatroomSlice/verify',
    async () => {
        const data = await fetch(`${baseApi}/auth/verify`, {
            type: 'GET',
            credentials: 'include',
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

const chatroomSlice = createSlice({
    name: 'chatroomSlice',
    initialState: {
        hasError: false,
        isLoading: false,
        userSignedIn: false
    },
    extraReducers: {
        [verifyUser.pending]: (state) => {
            state.isLoading = true;
            state.hasError = false
        },
        [verifyUser.fulfilled]: (state, action) => {
            console.log(action.payload)
            if(action.payload.status === 200){
                state.userSignedIn = true;
                console.log(state.userSignedIn);
            } else if (action.payload.status === 401) {
                state.userSignedIn = false
            }
        },
        [verifyUser.rejected]: (state, action) => {
            state.hasError = true;
        }
    }
})

export const userSignedIn = state => state.chatroomSlice.userSignedIn;
export default chatroomSlice.reducer;
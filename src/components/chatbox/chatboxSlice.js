import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { baseApi } from "../../app/App"


export const getMessages = createAsyncThunk(
    'chatboxSlice/sendMessage',
    async (obj) => {
        const data = await fetch(`${baseApi}/message`, {
            method: 'GET',
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

const chatboxSlice = createSlice({
    name:'chatboxSlice',
    initialState: {
        isLoading: false,
        hasError: false,
        currentRoom: {},
        errorMessage: ''
    },
    reducers: {
        setNewRoom: (state, action) => {
            state.currentRoom = action.payload;
        },
        getCurrentRoom: state => {
            return state.currentRoom;
        }
    },
    extraReducers: {
        [getMessages.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [getMessages.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                state.userRooms = action.payload.message;
            } else {
                state.hasError = true;
            }
        },
        [getMessages.rejected]: (state, action) => {
            state.hasError = true;
            state.errorMessage = action.payload.message;
        }
    }    
})

export const {setNewRoom} = chatboxSlice.actions
export const currentUserRoom = state => state.chatboxSlice.currentRoom;
export default chatboxSlice.reducer;
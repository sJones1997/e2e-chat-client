import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";

export const submitLogin = createAsyncThunk(
    'loginSlice/submitLogin', 
    async (obj) => {
        const {username, password} = obj;
        const validateCaps = /[A-Z]/
        const validateNum = /\d/
        if(password.match(validateCaps) && password.match(validateNum)){
            const basic = `${username}:${password}`;
            const basicEncoded = Buffer.from(basic).toString("base64");
            const data = await fetch(`${baseApi}/auth/login`, {
                method: 'POST',
                credentials: 'include', 
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${basicEncoded}`                    
                }
            });

            const {status} = data;
            const json = await data.json();
            json['status'] = status;
            return json;

        } else {
            return {"message": 'Password must contain at least one capital letter and one number.', "status": 0}            
        }
    }
)

const loginSlice = createSlice({
    name:'loginSlice',
    initialState:{
        isLoading: false,
        hasError: false,
        sessionActive: false,
        redirectRequired: false,
        errorMessage: ''
    },
    extraReducers: {
        [submitLogin.pending]: (state, action) => {
            state.isLoading = true;
        },
        [submitLogin.fulfilled]: (state, action) => {
            state.isLoading = false;
            console.log(action.payload)
            if(action.payload.status === 200){
                state.hasError = false;
                state.sessionActive = state.redirectRequired = true;
            } else {
                state.hasError = true;
                state.errorMessage = action.payload.message;
            }
        },
        [submitLogin.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true;
        }
    }
});

export const errorMessage = state => state.loginSlice.errorMessage;
export const errored = state => state.loginSlice.hasError;
export default loginSlice.reducer;
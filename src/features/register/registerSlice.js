import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {baseApi} from '../../app/App';

export const submitRegistration = createAsyncThunk(
    'registerSlice/submitRegistration', 
    async (obj) => {

        const {username, password, confirmPassword} = obj;        

        if(password === confirmPassword){
            const validateCaps = /[A-Z]/
            const validateNum = /\d/
            if(password.match(validateCaps) && password.match(validateNum)){
                const basic = `${username}:${password}:${confirmPassword}`;
                const basicEncoded = Buffer.from(basic).toString("base64");
                const data = await fetch(`${baseApi}/auth/register`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Basic ${basicEncoded}`
                    }
                });
                const {status} = data;
                const json = await data.json()
                json['status'] = status;
                return json;
            } else {
                return {"message": 'Password must contain at least one capital letter and one number.', "status": 0}
            }
        } else {
            return {"message": 'Passwords do not match, please try again.', "status": 0}
        }
    }
)


const registerSlice = createSlice({
    name:'registerSlice',
    initialState:{
        isLoading: false,
        hasError: false,
        sessionActive: false,
        redirectRequired:false,
        errorMessage: ''
    },
    extraReducers: {
        [submitRegistration.pending]: (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        },
        [submitRegistration.fulfilled]: (state, action) => {
            state.isLoading = false;
            if(action.payload.status === 200){
                state.hasError = false;
            } else {
                state.hasError = true;
                state.errorMessage = action.payload.message;
            }
        },
        [submitRegistration.rejected]: (state, action) => {
            state.isLoading = false;
            state.hasError = true            
        }
    }
})


export const errorMessage = state => state.registerSlice.errorMessage;
export const errored = state => state.registerSlice.hasError;
export default registerSlice.reducer;
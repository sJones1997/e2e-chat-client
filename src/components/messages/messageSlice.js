import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "../../app/App";

const messageSlice = createSlice({
    name:'messageSlice',
    initialState:{
        messages: [],

        errorMessage: '',
        successMessage: '',             
    },

    extraReducers: {

    }
})


export default messageSlice.reducer;
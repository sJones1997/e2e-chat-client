import { createSlice } from "@reduxjs/toolkit";


const searchBarSlice = createSlice({
    name: 'searchBarSlice',
    initialState: {
        searchResults: {}
    },
    reducers: {
        updateSearchResult: (state, action) => {
            state.searchResults = action.payload;
        }
    }
});

export const {updateSearchResult} = searchBarSlice.actions;
export const searchResults = state => state.searchBarSlice.searchResults;
export default searchBarSlice.reducer;
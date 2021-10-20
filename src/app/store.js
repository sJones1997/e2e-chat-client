import { configureStore, applyMiddleware, combineReducers } from "@reduxjs/toolkit";
import registerReducer from '../features/register/registerSlice';

const combinedReducer = combineReducers({
    registerSlice: registerReducer
})

const rootReducer = (state, action) => {
    if(action.type === ''){
        return combinedReducer(undefined, action);
    }
    return combinedReducer(state, action);
};

export default configureStore({
    reducer: rootReducer
  }, applyMiddleware);
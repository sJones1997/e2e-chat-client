import { configureStore, applyMiddleware, combineReducers } from "@reduxjs/toolkit";
import registerReducer from '../features/register/registerSlice';
import loginReducer from '../features/login/loginSlice';
import addRoomReducer from '../components/addroom/addroomSlice';
import sideMenuReducer from "../components/sidemenu/sidemenuSlice";


const combinedReducer = combineReducers({
    registerSlice: registerReducer,
    loginSlice: loginReducer,
    addRoomSlice: addRoomReducer,
    sideMenuSlice: sideMenuReducer
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
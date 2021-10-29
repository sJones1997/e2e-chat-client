import { configureStore, applyMiddleware, combineReducers } from "@reduxjs/toolkit";
import registerReducer from '../features/register/registerSlice';
import loginReducer from '../features/login/loginSlice';
import addRoomReducer from '../components/addroom/addroomSlice';
import sideMenuReducer from "../components/sidemenu/sidemenuSlice";
import chatboxReducer from '../components/chatbox/chatboxSlice';
import messageReducer from '../components/messages/messageSlice';
import roomPanelReducer from '../components/roompanel/roomPanelSlice';


const combinedReducer = combineReducers({
    registerSlice: registerReducer,
    loginSlice: loginReducer,
    addRoomSlice: addRoomReducer,
    sideMenuSlice: sideMenuReducer,
    chatboxSlice: chatboxReducer,
    messageSlice: messageReducer,
    roomPanelSlice: roomPanelReducer
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
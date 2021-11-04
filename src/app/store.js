import { configureStore, applyMiddleware, combineReducers } from "@reduxjs/toolkit";
import chatroomReducer from '../features/chatroom/chatroomSlice';
import registerReducer from '../features/register/registerSlice';
import loginReducer from '../features/login/loginSlice';
import addRoomReducer from '../components/addroom/addroomSlice';
import sideMenuReducer from "../components/sidemenu/sidemenuSlice";
import messageReducer from '../components/messages/messageSlice';
import roomPanelReducer from '../components/roompanel/roomPanelSlice';
import searchBarReducer from '../components/searchbar/searchbarSlice';

const combinedReducer = combineReducers({
    registerSlice: registerReducer,
    loginSlice: loginReducer,
    addRoomSlice: addRoomReducer,
    sideMenuSlice: sideMenuReducer,
    messageSlice: messageReducer,
    roomPanelSlice: roomPanelReducer,
    searchBarSlice: searchBarReducer,
    chatroomSlice: chatroomReducer    
})

const rootReducer = (state, action) => {
    if(action.type === 'roomPanelSlice/restoreState'){
        return combinedReducer(undefined, action);
    }
    return combinedReducer(state, action);
};

export default configureStore({
    reducer: rootReducer
  }, applyMiddleware);
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Register from '../features/register/Register';
import Login from '../features/login/Login';
import Chatroom from '../features/chatroom/Chatroom';
import { useEffect } from 'react';
export const baseApi = `${process.env.REACT_APP_API_URL}/api`;

function App() {

  useEffect(() => {
    const changeSize = () => {
      let viewport = document.querySelector("meta[name=viewport]");  
      viewport.setAttribute("content", "width=device-width, initial-scale=1");   
      let viewHeight = window.innerHeight;
      let viewWidth = window.innerWidth;    
      viewport.setAttribute("content", "height=" + viewHeight + "px, width=" + viewWidth + "px, initial-scale=1.0");      
    }  
  
    window.addEventListener('load', changeSize);
    window.addEventListener('resize', changeSize);
    return () => {
      window.removeEventListener('load');
      window.removeEventListener('resize');      
    }
  }, [])

  return (
    <div className="App">
        <Router>

          <Switch>
            <Route exact path='/' component={Chatroom} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </Router>
        <div className="overlay"></div>
    </div>
  );
}

export default App;

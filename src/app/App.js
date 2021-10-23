import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Register from '../features/register/Register';
import Login from '../features/login/Login';
import Chatroom from '../features/chatroom/Chatroom';
import socketIOCient from 'socket.io-client';
export const baseApi = `${process.env.REACT_APP_API_URL}/api`;
export const socket = socketIOCient(`${process.env.REACT_APP_API_URL}`, {
  withCredentials: true
});
socket.on("connect", () => {
  console.log(socket.id)
})

function App() {
  return (
    <div className="App">
      <Router>

        <Switch>
          <Route exact path='/' component={Chatroom} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

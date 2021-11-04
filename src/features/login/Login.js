import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import {verifyUser, userSignedIn} from '../chatroom/chatroomSlice';
import { submitLogin, errorMessage, errored } from "./loginSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import GoogleIcon from "../../components/googleicon/GoogleIcon";
import InfoBlock from "../../components/infoblock/infoblock";
import { Link } from "react-router-dom";


export default function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const errorMsg = useSelector(errorMessage);
    const hasError = useSelector(errored);
    const userAuthenticated = useSelector(userSignedIn);
    const history = useHistory();    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(verifyUser());
    }, [dispatch])

    useEffect(() => {
        if(userAuthenticated){
            history.push('/');
        }
    }, [userAuthenticated, history]);    

    const handleSubmission = (e) => {
        e.preventDefault();
        dispatch(submitLogin({username: username, password: password}))
        .then(() => {
            dispatch(verifyUser());            
        })
    }

    return (    
        <div className="login-container">
            <div className="form-container">
                <form onSubmit={(e) => {handleSubmission(e)}}>
                    <div className="form-header">
                        <h2>Login below</h2>
                    </div>
                    <div className="form-body">
                        <input type="text" placeholder="Username" min="3" max="100" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
                        <input type="password" placeholder="Password" min="8" max="100" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                    </div>
                    <div className="form-footer">
                        <div className="sign-in-options">
                            <input type="submit" value="Login" />                         
                            <GoogleIcon/>
                        </div>
                        <div className="register-prompt">
                            <p>New here? <Link to='/register'>Register an account</Link>.</p>                            
                        </div>                        
                    </div>
                </form>
            </div>
            {
                (hasError)
                ?
                <InfoBlock message={errorMsg} error={hasError} />
                :
                ''
            }            
        </div>
    )
}
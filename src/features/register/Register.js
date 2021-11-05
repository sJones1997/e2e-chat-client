import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import './register.css';
import {verifyUser, userSignedIn} from '../chatroom/chatroomSlice';
import { submitRegistration, errored, errorMessage } from "./registerSlice";
import { useDispatch } from "react-redux";
import InfoBlock from "../../components/infoblock/infoblock";
import GoogleIcon from "../../components/googleicon/GoogleIcon";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Register(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const errorMsg = useSelector(errorMessage);
    const hasError = useSelector(errored);
    const [confirmPassword, setConfirmPassword] = useState("");
    const userAuthenticated = useSelector(userSignedIn);
    const history = useHistory();    
    const dispatch = useDispatch();

    const handleSubmission = (e) => {
        e.preventDefault();
        dispatch(submitRegistration({username: username, password: password, confirmPassword: confirmPassword}))
        .then(() => {
            dispatch(verifyUser());            
        })
    }

    useEffect(() => {
        dispatch(verifyUser());
    }, [dispatch])    

    useEffect(() => {
        if(userAuthenticated){
            history.push('/');
        }
    }, [userAuthenticated, history]);        
    
    return (
        <div className="register-container">
            <div className="form-container">
                <form onSubmit={(e) => {handleSubmission(e)}}>
                    <div className="form-header">
                        <h2>Register an account</h2>
                    </div>                    
                    <div className="form-body">
                        <input type="text" min="3" max="100" value={username} onChange={(e) => {setUsername(e.target.value)}} placeholder="Username" />
                        <input type="password" min="8" max="100" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" />
                        <input type="password" min="8" max="100" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm Password" />
                    </div>
                    <div className="form-footer">
                        <div className="sign-in-options">
                            <input type="submit" value="Register" /> 
                            <GoogleIcon/>                                                     
                        </div>  
                        <div className="login-prompt">
                            <p>Already have an account? <Link to='/login'>Login here</Link>.</p>                            
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
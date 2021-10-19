import { useState } from "react";
import './register.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"

export default function Register(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="register-container">
            <div className="form-container">
                <form>
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
                            <input type="submit" value="Sign in" />
                            <span><FontAwesomeIcon icon={faGoogle} /></span>                            
                        </div>
                        <div className="login-prompt">
                            <p>Already have an account? <a href="Login">Login in</a>.</p>                            
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
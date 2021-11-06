import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import {baseApi} from '../../app/App';

export default function GoogleIcon(){
    return (
        <div>
            <span><a href={`${baseApi}/auth/google`}><FontAwesomeIcon icon={faGoogle} /></a></span>            
        </div>    
    )
}
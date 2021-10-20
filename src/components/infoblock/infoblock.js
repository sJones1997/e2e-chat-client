import { useEffect, useState } from "react";
import './infoblock.css'

export default function InfoBlock(match){

    const [info, setInfo] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const {message} = match;
        console.log(message);
        let response;
        if(typeof(message) === 'object'){
            response = message.map((e, i) => {
                return <p key={i}>{e}</p>;
            })
            setInfo(response);
        }
        const {error} = match;
        setInfo(<p>{message}</p>);
        setIsError(error);
        
    }, [match]);

    return (
        <div className="info-block">
            {
                info !== null
                ?
                <div className={isError === false ? 'block info' : 'block error'} >
                    {info ? info : ''}
                </div> 
                :
                ''                  
            }
        </div>
    );

}
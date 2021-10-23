import { useState } from "react";
import { socket } from "../../app/App";

export default function Messages(){

    const [newMessage, setNewMessage] = useState("")

    socket.on("receive-message", data => {
        console.log(data)
        setNewMessage(data);
    });

    return (
        <div>
            {newMessage}
        </div>
    )

}
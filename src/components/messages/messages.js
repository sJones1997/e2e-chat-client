import { useState } from "react";
import { socket } from "../../app/App";

export default function Messages(){

    const [newMessage, setNewMessage] = useState("")

    socket.on("receive-message", data => {
        console.log(data)
        setNewMessage(data);
    });

    socket.on("connect_error", err => {
        console.log(err.data)
    })

    return (
        <div>
            {newMessage}
        </div>
    )

}
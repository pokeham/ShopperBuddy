
import React from 'react';

import NavBar from "../components/NavBar.js"
import Chat from "../components/Chat.js"
import { Container, Row, Col } from 'react-bootstrap';

const ChatPage = () => {
    return (
        <div style={{backgroundColor: 'white',height: "100%",display:"flex"}}>
            <NavBar/>
            <Chat />
        </div>
    )
};

export default ChatPage;


import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/ChatRoom.css';
import ChatBox from './ChatBox'
const ChatRoom = ({sender,other})=>{
    const [messageList, setMessageList] = useState([]);
    useEffect(() => {
        temp();
        const interval = setInterval(() => {
            fetch('http://localhost:3001/api/populatechat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participants: [sender,other.replace(/"/g, '')]}),

            })
                .then(response => response.json())
                // .then(data => setMessageList(data))
                // .catch(console.error);
                .then(data => {
                    console.log("Fetched data:", data); // Log the fetched data
                    setMessageList(data);
                 })
                .catch(error => {
                    console.error(error);
                    setMessageList([]);
                });
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const temp = () =>{
        console.log()
    }
    return(
        <div className={'main-div-chat-room'}>
            <Container fluid className = {'main-container-chat-room'} >
                <Row className = {'bottom-row-chat-room'}>
                    {messageList.map((msg, index) => (
                        <Col xs = {12}  key = {index}>
                            <ChatBox sender = {msg.sender} data = {msg.content} actual = {sender}></ChatBox>
                        </Col>
                    ))}


                </Row>
            </Container>
        </div>
    )
};
export default ChatRoom;

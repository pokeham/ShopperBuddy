import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col , Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/ChatRoom.css';
import ChatBox from './ChatBox'
const ChatRoom = ({sender,other})=>{
    const [messageList, setMessageList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const sendMesssage = async (e) => {
        e.preventDefault();

        fetch('http://localhost:3001/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ participants: [sender,other], content: inputValue }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Handle success, update state, etc.
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle errors here
            });
    }

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
                    <div className={'dynamic-div'}>


                    {messageList.map((msg, index) => (
                        <Col xs = {12}  key = {index} className = {'dynamic-col'}>
                                <ChatBox sender = {msg.sender} data = {msg.content} actual = {sender}></ChatBox>

                        </Col>
                    ))}
                    </div>
                </Row>
                <Row className = {'text-entry-row'}>
                    <Col xs = {12} className = {'text-entry-col'}>
                        <Form onSubmit={sendMesssage} className="input-form">
                            <div className="input-group-chat-room">
                                <div className={'text-div'}>
                                    <textarea
                                        className="form-control-chat-room"
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        placeholder="Send a Chat :)"
                                    ></textarea>
                                </div>
                                <div className={'d-flex justify-content-end'}>
                                    <Button type="submit" className="input-button-chat">
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
};
export default ChatRoom;

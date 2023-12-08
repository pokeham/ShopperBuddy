import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/ChatRoom.css';
import ChatBox from './ChatBox'
const ChatRoom = ({temp})=>{
    return(
        <div className={'main-div-chat-room'}>
            <Container fluid className = {'main-container-chat-room'} >
                <Row className = {'bottom-row-chat-room'}>
                    <ChatRoom></ChatRoom>
                </Row>
            </Container>
        </div>
    )
};
export default ChatRoom;

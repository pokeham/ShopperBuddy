import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Chat.css';
import ChatModule from './ChatModule'
import ChatRoom from './ChatRoom'
function Chat(){
    const[clicked,setClicked] = useState(false);
    const[otherUser,setOtherUser] = useState("");
    const otherFunction = (temp) => {
        setOtherUser(temp)
    };
    const clickedFunction = () =>{
        setClicked(!clicked)
    }

    return(
        <div className={'main-div-chat'}>
            <Container className = {'main-container-chat'} fluid>
                <Row className = {'top-row-chat'}>
                    <Col className = {'header-col-chat'}>
                        <h1 className = {'chat-header'}>Chat Room</h1>
                    </Col>
                </Row>
                {clicked ? (
                        <ChatRoom temp = {otherUser}>

                        </ChatRoom>
                ):(
                    <Row className = {'bottom-row-chat-rrom'}>
                        <ChatModule loggedIn = {"Logged-in User"} Other = {"Recipient User"} clickedFunction = {clickedFunction} otherFunction = {otherFunction}></ChatModule>
                        <ChatModule loggedIn = {"Logged-in User"} Other = {"Recipient User"} clickedFunction = {clickedFunction} otherFunction = {otherFunction}></ChatModule>
                    </Row>
                )}

            </Container>
        </div>
    )
}export default Chat;

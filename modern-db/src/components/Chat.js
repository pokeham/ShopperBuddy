import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Chat.css';
import ChatModule from './ChatModule'
import ChatRoom from './ChatRoom'
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
function Chat(){
    const[clicked,setClicked] = useState(false);
    const[otherUser,setOtherUser] = useState("");
    const [sender, setSender] = useState(getCurrentUserId);
    const [chatList, setChatList] = useState(getChat);

    function getChat(){
        fetch('http://localhost:3001/api/populateroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currUser: sender }),
        })
            .then(response => response.json())
            .then(data => setChatList(data))
            .catch(console.error);
    }

    const otherFunction = (temp) => {
        setOtherUser(temp)
    };
    const clickedFunction = () =>{
        setClicked(!clicked)
    }
    function getCurrentUserId() {
        const token = Cookies.get('token');
        if (!token) return null;

        try {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken.username);
            return decodedToken.username;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
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
                        <ChatRoom other = {otherUser} sender = {"CURR"}>

                        </ChatRoom>
                ):(
                    <Row className = {'bottom-row-chat'}>
                        {chatList.map((chat,index)=>(
                            <div key = {index}>
                                <p>{chat.particpants}</p>
                            </div>

                            // <ChatModule loggedIn = {sender} Other = {chat.particpants[0] == sender ? chat.particpants[1] :chat.particpants[0]} clickedFunction = {clickedFunction} otherFunction = {otherFunction}></ChatModule>
                        ))}
                    </Row>
                )}

            </Container>
        </div>
    )
}export default Chat;

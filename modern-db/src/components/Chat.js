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
    const [chatList, setChatList] = useState([]);
    useEffect(() => {
        getChat();
    }, []);
    function getChat(){
        fetch('http://localhost:3001/api/populateroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currUser: sender }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data[0].participants); // Log the fetched data
                setChatList(data);
            })
            .catch(error => {
                console.error(error);
                setChatList([]);
            });
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
                        <ChatRoom other = {otherUser} sender = {sender}>

                        </ChatRoom>
                ):(
                    <Row className = {'bottom-row-chat'}>
                        {chatList.map((chat,index)=>(
                            <Col key = {index} xs = {12}>
                                <ChatModule  loggedIn = {sender} Other = {JSON.stringify(chat.participants[0]).replace(/"/g, '') == sender ? JSON.stringify(chat.participants[1]).replace(/"/g, '') : JSON.stringify(chat.participants[0]).replace(/"/g, '')} clickedFunction = {clickedFunction} otherFunction = {otherFunction}></ChatModule>
                            </Col>
                        ))}
                    </Row>
                )}

            </Container>
        </div>
    )
}export default Chat;

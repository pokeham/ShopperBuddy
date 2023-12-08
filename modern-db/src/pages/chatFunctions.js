import React, {useEffect, useRef, useState} from 'react';
import {Form, FormControl, Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import  {useNavigate}  from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/firebase';
import { Link } from 'react-router-dom';
import {browserSessionPersistence, setPersistence} from "firebase/auth";
import '../css/Home.css';
import neo4j from 'neo4j-driver';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";


function ChatFunctions(){

    const [sender, setSender] = useState(getCurrentUserId);
    const [receiver, serReceiver] = useState('receiver');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [chatList, setChatList] = useState([]);


    useEffect(() => {
        const interval = setInterval(() => {
            fetch('http://localhost:3001/api/populatechat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participants: [sender,receiver]}),
            })
                .then(response => response.json())
                .then(data => setMessageList(data))
                .catch(console.error);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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


        function createNewChat() {
            fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participants: [sender,receiver] }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }



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

    const sendMesssage = async (e) => {
        e.preventDefault();

        fetch('http://localhost:3001/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ participants: [sender,receiver], content: message }),
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

    function logout(){
        Cookies.remove('token');
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value);

    }

    return (
        <div>
            <h1>'Create a new chat'</h1>
            <Button
                className={'login-button'}
                variant="outline-success"
                type="submit"
                onClick={createNewChat}
                style={{ marginRight: '10px' }}
            >
                create chat
            </Button>

            <Form onSubmit={sendMesssage}>
                <Form.Label id = "username" className="form-header">Input message:</Form.Label>
                <FormControl
                    type="text"
                    placeholder="example@email.com"
                    value={message}
                    onChange={handleMessageChange}
                    style={{
                        marginLeft:'25%',
                        width: `50%`,
                    }}
                />
            </Form>
            <Button
                className={'login-button'}
                variant="outline-success"
                type="submit"
                onClick={getChat}
                style={{ marginRight: '10px' }}
            >
                get chat
            </Button>
            <div>
                {messageList.map((msg, index) => (
                    <div key={index} className="message" style={{ backgroundColor: '#3498db' }}>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div>
                {chatList.map((chat, index1) => (
                    <div key={index1} className="message" style={{ backgroundColor: '#e74c3c' }}>
                        <p>{chat.participants}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatFunctions;
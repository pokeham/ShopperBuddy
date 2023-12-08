import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/ChatModule.css';
const ChatModule = ({loggedIn,Other,clickedFunction,otherFunction})=>{
    const tempFunction = (temp) =>{
        clickedFunction();
        otherFunction(temp);
    }
    return(
        <div className={'main-div-chat-module'}>
            <Container className = {'main-container-chat-module'} fluid>
                <Row className = {'row-chat-module'}>
                    <Col xs = {1} className = {'icon-chat-module'}>
                        <div className={'profile-chat-module'}>
                            {/*insert appropriate icon text*/}
                            CA
                        </div>
                    </Col>
                    <Col xs = {7} className = {'content-col-chat-module'}>
                        <h1 className={'username-chat-module'}>
                            {/*insert appropriate other user text text*/}
                            Chat with : {Other}
                        </h1>
                    </Col>
                    <Col xs = {4} className = {'button-col-chat-module'}>
                        <Button className = {'view-chat-module'} onClick={() => tempFunction(Other)}>
                            <i className="bi bi-box-arrow-in-right"></i>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
};
export default ChatModule;

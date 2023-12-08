import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/ChatBox.css';
const ChatBox = ({data,sender})=>{
    return(
        <div className={'main-div-chat-box'}>
            {/*TODO SWITCH SIDES BASED ON SENDER */}
            <Container fluid className = {'main-container-chat-box'} >
                <Row className = {'top-row-chat-box'}>
                    <Col xs = {12} className = {'header-col-chat-box'}>

                    </Col>
                </Row>
                <Row className = {'content-row-chat-box'}>
                    <Col xs = {12} className = {'content-col-chat-box'}>

                    </Col>
                </Row>
            </Container>
        </div>
    )
};
export default ChatBox;

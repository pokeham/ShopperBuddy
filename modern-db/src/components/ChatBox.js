import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/ChatBox.css';
const ChatBox = ({data,sender,actual})=>{
    return(
        <div>
            <div className={'main-div-chat-box'}>
                {sender == actual ? (
                    <Container fluid className = {'main-container-chat-box-right'} >
                        <Row className = {'top-row-chat-box'}>
                            <Col xs = {12} className = {'header-col-chat-box'}>
                                {actual}
                            </Col>
                        </Row>
                        <Row className = {'content-row-chat-box'}>
                            <Col xs = {12} className = {'content-col-chat-box'}>
                                {data}
                            </Col>
                        </Row>
                    </Container>
                ):(
                    <Container fluid className = {'main-container-chat-box-left'} >
                        <Row className = {'top-row-chat-box'}>
                            <Col xs = {12} className = {'header-col-chat-box'}>
                                {sender}
                            </Col>
                        </Row>
                        <Row className = {'content-row-chat-box'}>
                            <Col xs = {12} className = {'content-col-chat-box'}>
                                {data}
                            </Col>
                        </Row>
                    </Container>
                )}
            </div>
        </div>

    )
};
export default ChatBox;

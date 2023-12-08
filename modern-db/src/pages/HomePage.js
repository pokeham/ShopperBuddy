import { Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { auth } from '../database/firebase';
import '../css/SignIn.css';
import{ createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth"
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import Cookies from "js-cookie";
import {Navigate, useNavigate} from 'react-router-dom';





function HomePage() {


    const navigate = useNavigate();





    const goTo = async (e) => {
        e.preventDefault();
        Cookies.remove('token');
        navigate("/login");

    }


    return (
        <div className={'main-div'}>
            <Container fluid className={'main-container'}>
                <Row className={'top-row'}>

                </Row>
                <Row className={'middle-row'}>
                    <Col xs = {3}>

                    </Col>
                    <Col xs = {6} className={'content-col'}>
                        <h1 className={'welcome-header'}>
                            Home Page
                        </h1>

                        <Button
                            className={'login-button'}
                            variant="outline-success"
                            type="submit"
                            onClick={goTo}
                            style={{ marginRight: '10px' }}
                        >
                            Check if loged in
                        </Button>



                    </Col>
                    <Col xs = {3}>

                    </Col>

                </Row>
                <Row className={'bottom-row'}>

                </Row>
            </Container>
        </div>
    )
}
export default HomePage;

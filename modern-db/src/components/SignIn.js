import { Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { auth } from '../database/firebase';
import '../css/SignIn.css';
import{ createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth"
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import {Navigate, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';





function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    const [showErrorEmail, setShowErrorEmail] = useState(false);
    const [showErrorPassword, setShowErrorPassword] = useState(false);
    const [errorEmailMessage, setErrorEmailMessage] = useState('');
    const [errorPasswordMessage, setErrorPasswordMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogIn = async (e) => {
        e.preventDefault();

        // Make a POST request to your backend for user login
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        // Check if authentication was successful based on the response
        if (response.ok) {

      console.log('in the login function');
            Cookies.set('token', data.token, { expires: 1 }); // Expires in 1 day
            navigate('/user');
        }


    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Make a POST request to your backend for user registration
        const response = await fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log(data);

        // Check if authentication was successful based on the response
        if (response.ok) {

            Cookies.set('token', data.token, { expires: 1 }); // Expires in 1 day
            console.log('in the login function');
            navigate('/user');
        }
    };
    const handleEmailChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    //
    // const handleFormSubmit = (event) => {
    //     event.preventDefault();
    //     tryLogin();
    //
    // };

    const goTo = async (e) => {
        e.preventDefault();
        navigate('/user');
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
                            WELCOME
                        </h1>
                        <Form onSubmit={goTo}>
                            <Form.Label id = "username" className="form-header">Enter your email:</Form.Label>
                            <FormControl
                                type="text"
                                placeholder="example@email.com"
                                value={username}
                                onChange={handleEmailChange}
                                style={{
                                    marginLeft:'25%',
                                    width: `50%`,
                                    marginBottom: showErrorEmail ? '5px' : '20px',
                                    ...(showErrorEmail && {
                                        outline: '2px solid #ff3333',
                                        boxShadow: '0 0 10px rgba(251, 37, 118, 0.5)',
                                    }),
                                }}
                            />{showErrorEmail && <div className={"error-message"} style={{ alignSelf: 'flex-start', flexWrap: 'wrap' }} >{errorEmailMessage}</div>}
                        </Form>
                        <Form onSubmit={goTo}>
                            <Form.Label if = "password" className="form-header">Enter password:</Form.Label>
                            <div className="password-container">
                                <InputGroup style={{
                                    marginLeft:'25%',
                                    width: `50%`,
                                    marginBottom: showErrorPassword ? '5px' : '40px',
                                    ...(showErrorPassword && {
                                        outline: '2px solid #ff3333',
                                        boxShadow: '0 0 10px rgba(251, 37, 118, 0.5)',
                                    }),
                                }}>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}


                                    />

                                    <Button
                                        variant="outline-secondary"
                                        onClick={togglePasswordVisibility}
                                        className="submit-button"
                                    >
                                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                                    </Button>

                                </InputGroup>
                            </div>
                            {showErrorPassword && (
                                <div className="error-message-container">
                                    <div className="error-message">{errorPasswordMessage}</div>
                                </div>
                            )}
                        </Form>
                        <Button
                            className={'login-button'}
                            variant="outline-success"
                            type="submit"
                            onClick={handleLogIn}
                            style={{ marginRight: '10px' }}
                        >
                            Login
                        </Button>
                        <Button
                            className={'login-button'}
                            variant="outline-success"
                            type="submit"
                            onClick={handleSignUp}
                        >
                            Sign Up
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
export default SignIn;

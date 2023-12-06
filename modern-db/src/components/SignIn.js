import { Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { auth } from '../database/firebase';
import '../css/SignIn.css';
import{ createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth"
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import  {useNavigate}  from 'react-router-dom';



function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorEmail, setShowErrorEmail] = useState(false);
    const [showErrorPassword, setShowErrorPassword] = useState(false);
    const [errorEmailMessage, setErrorEmailMessage] = useState('');
    const [errorPasswordMessage, setErrorPasswordMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleAuth = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            navigate('/User');
        } catch (signInError) {
            if (signInError.code === 'auth/invalid-credential') {

                try {
                    const newUserCredentials = await createUserWithEmailAndPassword(auth, email, password);
                    navigate('/User');
                } catch (signUpError) {
                    console.error('sing up error: ' + signUpError.message);
                    loginErrorHandling(signUpError.message);
                }
            } else {
                console.error('log in error: ' + signInError.message);
                loginErrorHandling(signInError.message);
            }
        }
    }
    const loginErrorHandling = (errorString) => {
        if (errorString === 'Firebase: Error (auth/invalid-email).') {
            setShowErrorEmail(true);
            setErrorEmailMessage("Invalid email format")
        } else if (errorString === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
            setShowErrorPassword(true);
            setErrorPasswordMessage("Password must be at least 6 characters ")
        } else if (errorString === 'Firebase: Error (auth/email-already-in-use).') {
            setShowErrorPassword(true);
            setErrorPasswordMessage("Email is already in use, if this is your account the password is incorrect")
        } else if (errorString === 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).') {
            setShowErrorEmail(true);
            setErrorEmailMessage("Account temporarily disabled due to too many login attempts")
        }

    }
    const tryLogin = () => {
        if (email !== '' && password !== '') {
            setShowErrorPassword(false);
            setShowErrorEmail(false);
            handleAuth().then(r => r);
        }
        if (email === '') {
            setShowErrorEmail(true);
            setErrorEmailMessage("Missing email");
        } else {
            setShowErrorEmail(false);
        }
        if (password === '') {
            setShowErrorPassword(true);
            setErrorPasswordMessage("Missing password");
        } else {
            setShowErrorPassword(false);
        }
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        tryLogin();

    };
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
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Label id = "email" className="form-header">Enter your email:</Form.Label>
                            <FormControl
                                type="text"
                                placeholder="example@email.com"
                                value={email}
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
                        <Form onSubmit={handleFormSubmit}>
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
                                onClick={handleFormSubmit}
                            >
                                Login / Sign Up
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

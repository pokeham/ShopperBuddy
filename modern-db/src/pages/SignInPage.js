import React from 'react';
import Container from "react-bootstrap/Container";
import SignIn from "../components/SignIn";

const SignInPage = () => {
    return (
        <div style={{backgroundColor: '#000000',height: "100%",overflowY: "hidden"}}>
            <SignIn />
        </div>
    )
};

export default SignInPage;
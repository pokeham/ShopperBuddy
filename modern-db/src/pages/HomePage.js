
import React from 'react';

import SignIn from "../components/Home.js";
import NavBar from "../components/NavBar.js"
import Home from "../components/Home.js"
import { Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
    return (
        <div style={{backgroundColor: 'white',height: "100%",display:"flex"}}>
            <NavBar/>
            <Home />
        </div>
    )
};

export default HomePage;


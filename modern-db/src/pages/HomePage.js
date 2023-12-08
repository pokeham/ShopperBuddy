
import React from 'react';

import NavBar from "../components/NavBar.js"
import Home from "../components/Home.js"

const HomePage = () => {
    return (
        <div style={{backgroundColor: 'white',height: "100%",display:"flex"}}>
            <NavBar/>
            <Home />
        </div>
    )
};

export default HomePage;


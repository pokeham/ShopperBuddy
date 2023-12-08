import React, {useEffect, useRef, useState} from 'react';
import { Navbar, Nav, Image , Dropdown} from 'react-bootstrap';
import { FaUser, FaEnvelope, FaHome } from 'react-icons/fa'
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import  {useNavigate}  from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/firebase';
import { Link } from 'react-router-dom';
import {browserSessionPersistence, setPersistence} from "firebase/auth";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import '../css/NavBar.css';

function NavBar(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [signedIn, setSignedIn] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [sender, setSender] = useState(getCurrentUserId);
    function logout(){
        Cookies.remove('token');
        navigate('/');
    }
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
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Clicked outside the dropdown, close it
                setDropdownOpen(false);
            }
        };
            document.addEventListener('mousedown', handleClickOutside);

            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
                setLoading(false);
            });
            // Detach the event listener when the component unmounts
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                unsubscribe();
            };
        }, []);
    const handleSignOut = async () => {
        try {
            await auth.signOut();
            // Additional logic after signing out, if needed
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div style={{background:"white", width:"8vw", height:"100vh"}}>

        <Navbar className="sidebar">
            <Dropdown className = "dropdown-right">
                <Dropdown.Toggle className="profile-icon">
                    {sender[0]}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item className = "item">{sender}</Dropdown.Item>
                    <Dropdown.Item className = "item">
                        <Button className = "custom-link" onClick = {logout}>Sign Out</Button> {/*TO DO MAKE LOG OUT*/}
                    </Dropdown.Item>


                </Dropdown.Menu>
            </Dropdown>
            <Nav className="flex-column">
                <Nav.Link as = {Link} to = "/chat "className = "nav-link" >
                    <FaEnvelope className="icon" />
                </Nav.Link>
                <Nav.Link as = {Link} to = "/user"className = "nav-link">
                    <FaHome className="icon" />
                </Nav.Link>
            </Nav>
        </Navbar>
        </div>
    )
}export default NavBar;
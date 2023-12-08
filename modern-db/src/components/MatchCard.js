import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import  {useNavigate}  from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/MatchCard.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const MatchCard = ({ customer, driver, updateCustomers })=>{
    const handleMarkAsSeen = () => {
        if (driver && customer) {
            const session = driver.session();
            const markAsSeenQuery = `
                MATCH (c:Customer {Name: $currLogged})
                SET c.Seen = c.Seen + $currSelected
            `;
            const params = {
                currSelected: customer.customerName,

                currLogged: 'Cheyenne Newman' // Replace with the name of the logged-in customer
            };

            session.run(markAsSeenQuery, params)
                .then(() => {
                    // Update your customer list or UI here as needed
                    updateCustomers(customer.customerName);
                })
                .catch(error => console.error(error))
                .finally(() => session.close());

        }
    };
    const check = () =>{
        handleMarkAsSeen()
        //enter rafa code to make chat
    }
    return(
        <div className={'main-card-div'}>
            <Container className = {'card-container'} fluid >
                <Row className = {'top-row-card'}>
                    <img src='image.png' className={'profile-img'}/>
                </Row>
                <Row className = {'bottom-row-card'}>
                    <Col xs = {12} className = {'content-col-match'}>
                        <h1 className={'profile-header'}>Name: {customer ? customer.customerName : 'No Customer Selected'}</h1>
                        {customer && (
                            <>
                                <p className={'customer-data'}>Similarity: {customer.totalScore.toFixed(4)*100}%</p>
                                <p className={'customer-data'}>City/Cities: {customer.cities}</p>
                                <Button variant="link" onClick={check} className="icon-button">
                                    <i className="bi bi-check-circle-fill"></i>
                                </Button>
                                <Button variant="link" onClick = {handleMarkAsSeen} className="icon-button">
                                    <i className="bi bi-x-circle-fill"></i>
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default MatchCard
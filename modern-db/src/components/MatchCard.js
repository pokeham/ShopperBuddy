import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import  {useNavigate}  from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/MatchCard.css';

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
            console.log(customer.customerName)
            session.run(markAsSeenQuery, params)
                .then(() => {
                    // Update your customer list or UI here as needed
                    updateCustomers(customer.customerName);
                })
                .catch(error => console.error(error))
                .finally(() => session.close());
        }
    };
    return(
        <div className={'main-card-div'}>
            <Container className = {'card-container'} fluid >
                <Row className = {'top-row'}>
                    <img src='image.png' className={'profile-img'}/>
                </Row>
                <Row className = {'bottom-row'}>
                    <Col xs = {12} className = {'content-col'}>
                        <h1 className={'profile-header'}>Name: {customer ? customer.customerName : 'No Customer Selected'}</h1>
                        {customer && (
                            <>
                                <p className={'customer-data'}>Similarity: {customer.totalScore.toFixed(4)*100}%</p>
                                <p className={'customer-data'}>City/Cities: {customer.cities}</p>
                                <Button onClick={handleMarkAsSeen}>

                                </Button>
                                <Button onClick = {handleMarkAsSeen}>

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
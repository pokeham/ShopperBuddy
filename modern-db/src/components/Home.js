import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import  {useNavigate}  from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/firebase';
import { Link } from 'react-router-dom';
import {browserSessionPersistence, setPersistence} from "firebase/auth";
import '../css/Home.css';
import neo4j from 'neo4j-driver';
import MatchCard from './MatchCard';
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";


function Home(){
    const [similarCustomers, setSimilarCustomers] = useState([]);
    const [driver, setDriver] = useState(null);
    const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);

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

    function logout(){
        Cookies.remove('token');
    }

    useEffect(() => {
        const newDriver = neo4j.driver('neo4j+s://ed0f2f4d.databases.neo4j.io', neo4j.auth.basic('neo4j', '4fYiaR4Kq-rJCEiJLd0lBzQpq3x0h2NPYJ5vCsNifsQ'));
        setDriver(newDriver);

        return () => {
            if (driver) {
                driver.close();
            }
        };
    }, []);

    useEffect(() => {
        if (driver) {
            const session = driver.session();
            const query = `
            MATCH (c1:Customer), (c2:Customer) 
            WHERE c1 <> c2 AND c1.Name = $customerName AND NOT c2.Name IN c1.Seen
            With c1,c2,
            c2.Cities As cities
            WITH c1,c2,cities, 
                1 / (1 + log(1 + abs(size(c1.Transactions) - size(c2.Transactions)))) AS transactionSimilarity 
            WITH c1, c2, transactionSimilarity, cities,
                1 / (1 + abs(coalesce(c1.Total_Cost, 0) - coalesce(c2.Total_Cost, 0)) + 
                abs(coalesce(c1.Total_Items, 0) - coalesce(c2.Total_Items, 0))) AS numericSimilarity 
            WITH c1, c2, numericSimilarity,transactionSimilarity, cities,
                size([store IN c1.Store_Types WHERE store IN c2.Store_Types]) AS intersectionSize, // Size of Intersection 
                size(apoc.coll.union(c1.Store_Types, c2.Store_Types)) AS unionSize // Size of Union 
            WITH c1, c2, numericSimilarity, intersectionSize, unionSize, transactionSimilarity,cities, 
                CASE WHEN unionSize > 0 THEN intersectionSize * 1.0 / unionSize ELSE 0 END AS storeTypeSimilarity, 
                CASE WHEN c1.Catagory = c2.Catagory THEN 5 ELSE 0 END AS categorySimilarity 
            RETURN c2.Name AS name, numericSimilarity, storeTypeSimilarity,cities,categorySimilarity,unionSize,intersectionSize,transactionSimilarity,  
            (numericSimilarity + storeTypeSimilarity + categorySimilarity+transactionSimilarity) / 8 AS totalScore 
            ORDER BY totalScore DESC 
            LIMIT 20 
          `;
            //c1.Total_Cost,c2.Total_Cost,c1.Total_Items,c2.Total_Items, size(c1.Transactions),size(c2.Transactions),
            const params = { customerName: 'Cheyenne Newman' }; // Replace with the desired customer name

            session
            .run(query,params)
            .then((result) => {
                const similarCustomers = result.records.map((record) => ({
                    customerName: record.get('name'),
                    numericSimilarity: record.get('numericSimilarity'),
                    storeTypeSimilarity: record.get('storeTypeSimilarity'),
                    categorySimilarity: record.get('categorySimilarity'),
                    unionSize: record.get('unionSize'),
                    intersectionSize: record.get('intersectionSize'),
                    transactionSimilarity: record.get('transactionSimilarity'),
                    totalScore: record.get('totalScore'),
                    cities: record.get('cities')
                }));
                setSimilarCustomers(similarCustomers);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                session.close();
            });
        }
    }, [driver]);
    const handlePreviousClick = () => {
        if (currentCustomerIndex > 0) {
            setCurrentCustomerIndex(currentCustomerIndex - 1);
        }
    };
    const removeSeenCustomer = (seenCustomerName) => {
        const updatedCustomers = similarCustomers.filter(customer => customer.customerName !== seenCustomerName);
        setSimilarCustomers(updatedCustomers);

        // If the current customer was removed, adjust the index to show the next customer
        if (currentCustomerIndex >= updatedCustomers.length) {
            setCurrentCustomerIndex(Math.max(0, updatedCustomers.length - 1));
        }
    };

    const handleNextClick = () => {
        if (currentCustomerIndex < similarCustomers.length - 1) {
            setCurrentCustomerIndex(currentCustomerIndex + 1);
        }
    };


    return (
        <div className={'main-div-home'}>
            <Container className = {'main-container-home'} fluid >
                <Row>
                    <Col xs = {12} className = {'top'}></Col>
                </Row>
                <Row>
                    <Col xs = {3} className = {'middle'}>
                        <Button onClick={handlePreviousClick} disabled={currentCustomerIndex === 0} className = {'prev'}>
                            <i className="bi bi-arrow-left"></i>
                        </Button>
                    </Col>
                    <Col xs = {6} className = {'middle'}>
                        <MatchCard customer={similarCustomers[currentCustomerIndex]} driver={driver} updateCustomers={removeSeenCustomer} />
                    </Col>
                    <Col xs = {3} className = {'middle'}>
                        <Button onClick={handleNextClick} disabled={currentCustomerIndex === similarCustomers.length - 1} className = {'next'}>
                            <i className="bi bi-arrow-right"></i>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs = {12} className = {'bottom'}></Col>
                </Row>
            </Container>

            {/*<h1>Similar Customers to Customer 'Cheyenne Newman'</h1>*/}
            {/*{similarCustomers.map((customer, index) => (*/}
            {/*    <p key={index}>*/}
            {/*        Name: {customer.name}*/}
            {/*        Customer Name: {customer.customerName}*/}
            {/*        Numeric Similarity: {customer.numericSimilarity.toFixed(2)} /!* Assuming numericSimilarity is an object *!/*/}
            {/*        Store Type Similarity: {customer.storeTypeSimilarity.toFixed(2)} /!* Modify accordingly *!/*/}
            {/*        Category Similarity: {customer.categorySimilarity.low}*/}
            {/*        Union Size: {customer.unionSize.low}*/}
            {/*        Intersection Size: {customer.intersectionSize.low}*/}
            {/*        Transaction Similarity: {customer.transactionSimilarity.low}*/}
            {/*        Total Score: {customer.totalScore.toFixed(2)}*/}
            {/*    </p>*/}
            {/*))}*/}

        </div>
    );
};

export default Home;
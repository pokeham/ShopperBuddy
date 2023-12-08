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
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";


function Home(){
    const [similarCustomers, setSimilarCustomers] = useState([]);
    const [driver, setDriver] = useState(null);

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
        const newDriver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
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
            MATCH (t:Transaction {Customer_Name: $customerName})
            WITH t
            MATCH (otherT:Transaction)
            WHERE otherT.Customer_Name <> $customerName
            WITH t, otherT,
              algo.similarity.jaccard(t.Store_Type, otherT.Store_Type) AS storeSimilarity,
              algo.similarity.jaccard(t.Payment_Method, otherT.Payment_Method) AS paymentSimilarity
            WHERE storeSimilarity > 0.5  // Adjust the threshold as needed
              AND paymentSimilarity > 0.5  // Adjust the threshold as needed
              AND ABS(t.Total_Cost - otherT.Total_Cost) <= 10  // Adjust the threshold as needed
            RETURN otherT.Customer_Name AS customerName, 
                   storeSimilarity, 
                   paymentSimilarity
            LIMIT 10
          `;

            const params = { customerName: 'Cheyenne Newman' }; // Replace with the desired customer name

            session
            .run(query, params)
            .then((result) => {
                const similarCustomers = result.records.map((record) => ({
                    customerName: record.get('customerName'),
                    storeSimilarity: record.get('storeSimilarity').toFloat(),
                    paymentSimilarity: record.get('paymentSimilarity').toFloat(),
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


    return (
        <div>
            <h1>Similar Customers to Customer 'Cheyenne Newman'</h1>
            <ul>
                {similarCustomers.map((customer, index) => (
                    <li key={index}>
                        {customer.customerName} - Store Similarity: {customer.storeSimilarity.toFixed(2)} - Payment Similarity: {customer.paymentSimilarity.toFixed(2)}
                    </li>
                ))}
            </ul>

            <Button
                className={'login-button'}
                variant="outline-success"
                type="submit"
                onClick={getCurrentUserId}
                style={{ marginRight: '10px' }}
            >
                getUser
            </Button>

            <Button
                className={'login-button'}
                variant="outline-success"
                type="submit"
                onClick={logout}
                style={{ marginRight: '10px' }}
            >
                logout
            </Button>
        </div>
    );
};

export default Home;
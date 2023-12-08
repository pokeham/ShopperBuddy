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
function Home(){
    const [similarCustomers, setSimilarCustomers] = useState([]);
    const [driver, setDriver] = useState(null);

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
            WHERE c1 <> c2 AND c1.Name = $customerName
            WITH c1,c2, 
                1 / (1 + log(1 + abs(size(c1.Transactions) - size(c2.Transactions)))) AS transactionSimilarity 
            WITH c1, c2, transactionSimilarity, 
                1 / (1 + abs(coalesce(c1.Total_Cost, 0) - coalesce(c2.Total_Cost, 0)) + 
                abs(coalesce(c1.Total_Items, 0) - coalesce(c2.Total_Items, 0))) AS numericSimilarity 
            WITH c1, c2, numericSimilarity,transactionSimilarity, 
                size([store IN c1.Store_Types WHERE store IN c2.Store_Types]) AS intersectionSize, // Size of Intersection 
                size(apoc.coll.union(c1.Store_Types, c2.Store_Types)) AS unionSize // Size of Union 
            WITH c1, c2, numericSimilarity, intersectionSize, unionSize, transactionSimilarity, 
                CASE WHEN unionSize > 0 THEN intersectionSize * 1.0 / unionSize ELSE 0 END AS storeTypeSimilarity, 
                CASE WHEN c1.Catagory = c2.Catagory THEN 5 ELSE 0 END AS categorySimilarity 
            RETURN c2.Name AS name, numericSimilarity, storeTypeSimilarity, categorySimilarity,unionSize,intersectionSize,transactionSimilarity, 
            (numericSimilarity + storeTypeSimilarity + categorySimilarity+transactionSimilarity) / 8 AS totalScore 
            ORDER BY totalScore DESC 
            LIMIT 10 
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
            {similarCustomers.map((customer, index) => (
                <p key={index}>
                    Name: {customer.name}
                    Customer Name: {customer.customerName}
                    Numeric Similarity: {customer.numericSimilarity.low} {/* Assuming numericSimilarity is an object */}
                    Store Type Similarity: {customer.storeTypeSimilarity.low} {/* Modify accordingly */}
                    Category Similarity: {customer.categorySimilarity.low}
                    Union Size: {customer.unionSize.low}
                    Intersection Size: {customer.intersectionSize.low}
                    Transaction Similarity: {customer.transactionSimilarity.low}
                    Total Score: {customer.totalScore.low}
                </p>
            ))}
        </div>
    );
};

export default Home;
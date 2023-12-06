import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Neo4jProvider,createDriver} from "use-neo4j";

const neo4j = require('neo4j-driver');
const driver = neo4j.driver('neo4j+s://69b9f662.databases.neo4j.io',neo4j.auth.basic('neo4j','XnYgkn_t-t4YBD4-K-vf_y0Ws49fm1fIitxeXGASkvY'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Neo4jProvider driver={driver}>
          <App />
      </Neo4jProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

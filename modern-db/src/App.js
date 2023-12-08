import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import SignInPage from "./pages/SignInPage";
import ChatPage from './pages/ChatPage'
import {useReadCypher, useWriteCypher} from "use-neo4j";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/protectedRoute";
import ChatFunctions from "./pages/chatFunctions";
function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/user" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
  );
}

export default App;

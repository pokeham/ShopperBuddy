import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage"
import {useReadCypher, useWriteCypher} from "use-neo4j";
function App() {
    const { loading, error, first, records } = useReadCypher('MATCH (n) RETURN count(n) AS count ');

  return (
      <Router>
        <div>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/Home" element={<HomePage />} />
            </Routes>
        </div>
      </Router>
  );
}

export default App;

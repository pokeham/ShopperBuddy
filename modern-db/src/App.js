import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import SignInPage from "./pages/SignInPage";
function App() {
  return (
      <Router>
        <div>
            <Routes>
                <Route path="/" element={<SignInPage />} />
            </Routes>
        </div>
      </Router>
  );
}

export default App;

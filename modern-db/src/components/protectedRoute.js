import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ProtectedRoute({ children }) {
    const token = Cookies.get('token');
    if (!token) {
        // User not authenticated
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;

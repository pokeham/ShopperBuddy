import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function SignedInRoute({ children }) {
    const token = Cookies.get('token');
    if (token) {
        // User not authenticated
        return <Navigate to="/user" />;
    }

    return children;
}

export default SignedInRoute;

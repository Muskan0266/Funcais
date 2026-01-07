// components/IsAuthN.jsx
import { Navigate } from "react-router-dom";

const AuthRoute = ({ element, authType }) => {
    const isAuth = localStorage.getItem("token");

    if (authType === "protected") {
        // For pages like /main, /profile, /challenges
        return isAuth ? element : <Navigate to="/login" replace />;
    }

    if (authType === "public") {
        // For pages like /login, /signup, /landing
        return isAuth ? <Navigate to="/main" replace /> : element;
    }

    return element;
};

export default AuthRoute;
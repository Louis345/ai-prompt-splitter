import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const { token } = useAuth();

  return token ? element : <Navigate to="/signin" />;
};

export default PrivateRoute;

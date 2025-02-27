import { Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const token = localStorage.getItem("Admin2025Token");

  return token ? <Route {...rest} component={Component} /> : null;
};

export default ProtectedRoute;

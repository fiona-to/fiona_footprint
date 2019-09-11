import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

// Custom Components
import AuthContext from "../contexts/auth-context";

const Logout = props => {
  const { logout } = useContext(AuthContext);

  const clearProfile = () => {
    logout();
  };

  return (
    <div>
      {clearProfile()}
      {<Redirect to="/" />}
    </div>
  );
};

export default Logout;

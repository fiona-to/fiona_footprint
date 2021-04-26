import React from "react";

// 1. Instead saving payload to state via creating a class or
// function component, we saved payload inside App.js, therefore
// we do not need to use useContext inline with Context.Provider
// 2. We pass an object to function createContext, it is
// default value only
const AuthContext = React.createContext({
  userId: null,
  token: null,
  tokenExp: null,
  profile: null,
  login: () => {},
  logout: () => {},
});
export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;

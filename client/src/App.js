import React, { useState, useEffect } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Use React context
import { AuthProvider } from "./contexts/auth-context";

// Custom Components
import NavigationBar from "./components/NavigationBar";
import PageNotExist from "./components/PageNotExist";
import CityReviewList from "./components/CityReviewList";
import AddAuthor from "./components/AddAuthor";
import AddUser from "./components/AddUser";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Footer from "./components/Footer";

// set up ApolloClient to connect to graphQL server
// const link = new HttpLink({
//   uri: 'http://localhost:4000/graphql
// });
const link = createUploadLink({
  uri: "http://localhost:4000/graphql"
});
const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link
});

const App = () => {
  let [userId, setUserId] = useState(null);
  let [token, setToken] = useState(null);
  let [tokenExp, setTokenExp] = useState(null);
  let [profile, setProfile] = useState(null);
  let [isAdd, setIsAdd] = useState(false);
  let [isEdit, setIsEdit] = useState(false);
  let [isLogIn, setIsLogIn] = useState(false);
  let [interestId, setInterestId] = useState("5d4b0ebf57981e0654f5bebf");
  // CANNOT USE useContext INLINE WITH Context.Provider
  // IN THIS CASE IS AuthProvider
  //const authContext = useContext(AuthContext);

  // This funciton will be called everytime component did mount or
  // component did update.
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));
    setProfile(localStorage.getItem("profile"));
    setTokenExp(localStorage.getItem("tokenExp"));
  }, [isLogIn]);

  const clearLocalStorage = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExp");
    localStorage.removeItem("profile");
    localStorage.removeItem("isLogIn");
  };

  const saveLocalStorage = (userId, token, tokenExp, profile) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExp", tokenExp);
    localStorage.setItem("profile", profile);
  };

  const login = ({ userId, token, tokenExp, profile }) => {
    saveLocalStorage(userId, token, tokenExp, profile);
  };

  const logout = () => {
    // clear context's data
    setUserId(null);
    setToken(null);
    setTokenExp(null);
    setProfile(null);
    // exit add mode
    handleAddTopic(false);
    // exit edit mode
    handleEditTopic(false);
    clearLocalStorage();
    handleLogIn(false);
  };

  const handleAddTopic = value => {
    setIsAdd(value);
  };

  const handleEditTopic = value => {
    setIsEdit(value);
  };

  const handleLogIn = value => {
    setIsLogIn(value);
  };

  const handleInterestChange = id => {
    setInterestId(id);
  };

  return (
    <Router>
      <ApolloProvider client={client}>
        <AuthProvider
          value={{ userId, token, profile, tokenExp, login, logout }}
        >
          <div id="main">
            <NavigationBar
              handleAddTopic={handleAddTopic}
              handleEditTopic={handleEditTopic}
            />
            <Switch>
              <Route
                path="/"
                render={props => (
                  <CityReviewList
                    {...props}
                    isAdd={isAdd}
                    isEdit={isEdit}
                    handleAddTopic={handleAddTopic}
                    handleEditTopic={handleEditTopic}
                    interestId={interestId}
                  />
                )}
                exact
              />
              {token && (
                <Route
                  path="/AddAuthor"
                  render={props => (
                    <AddAuthor
                      {...props}
                      isAdd={isAdd}
                      isEdit={isEdit}
                      handleAddTopic={handleAddTopic}
                      handleEditTopic={handleEditTopic}
                    />
                  )}
                />
              )}
              {token && (
                <Route
                  path="/AddUser"
                  render={props => (
                    <AddUser
                      {...props}
                      isAdd={isAdd}
                      isEdit={isEdit}
                      handleAddTopic={handleAddTopic}
                      handleEditTopic={handleEditTopic}
                    />
                  )}
                />
              )}
              {!token && (
                <Route
                  path="/Login"
                  render={props => (
                    <Login
                      {...props}
                      isLogIn={isLogIn}
                      handleLogIn={handleLogIn}
                    />
                  )}
                />
              )}
              {token && <Route path="/Logout" component={Logout} />}
              <Route component={PageNotExist} />
            </Switch>
            <Footer handleInterestChange={handleInterestChange} />
          </div>
        </AuthProvider>
      </ApolloProvider>
    </Router>
  );
};

export default App;

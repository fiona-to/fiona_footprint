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
  logout: () => {}
});
export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;

// export const AuthContext = createContext();
// class AuthContextProvider extends Component {
//   state = {
//     userId: null,
//     token: null,
//     tokenExp: null,
//     profile: null
//   };
//   login = ({ userId, token, tokenExp, profile }) => {
//     this.setState({ userId, token, tokenExp, profile });
//   };
//   logout = () => {
//     // clear context's data
//     this.setState({ userId: null, token: null, tokenExp: null, profile: null });
//   };
//   render() {
//     return (
//       <AuthContext.Provider
//         value={{ ...this.state, login: this.login, logout: this.logout }}
//       >
//         {this.props.children}
//       </AuthContext.Provider>
//     );
//   }
// }
// export default AuthContextProvider;

// const AuthContextProvider = props => {
//   let [userId, setUserId] = useState(null);
//   let [token, setToken] = useState(null);
//   let [tokenExp, setTokenExp] = useState(null);
//   let [profile, setProfile] = useState(null);
//   const login = ({ userId, token, tokenExp, profile }) => {
//     setUserId(userId);
//     setToken(token);
//     setTokenExp(tokenExp);
//     setProfile(profile);
//   };
//   const logout = () => {
//     // clear context's data
//     setUserId(null);
//     setToken(null);
//     setTokenExp(null);
//     setProfile(null);
//   };
//   return (
//     <AuthContext.Provider
//       value={{ userId, token, tokenExp, profile, login, logout }}
//     >
//       {props.children}
//     </AuthContext.Provider>
//   );
// };
// export default AuthContextProvider;

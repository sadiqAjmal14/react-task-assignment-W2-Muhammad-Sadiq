import { createContext, useState } from "react";

// Create the context with default values
export const LoginStateContext = createContext({
  pending: false,
  token: null,
  error: null,
  userName:null,
  setCurrentPage: null,
  setLoginPending:null,
  setToken:null,
  setLoginError:null,
  setUserName:null,
});

const LoginContextProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState({
    pending: false,
    token: JSON.parse(localStorage.getItem('token')),
    error: null,
    userName:null,
    setLoginPending:(pending)=>{
        setLoginInfo((prev) => ({ ...prev, pending: pending }));
    },
    setToken:(token)=>{
        setLoginInfo((prev) => ({ ...prev, token: token }));
    },
    setLoginError:(error)=>{
        setLoginInfo((prev) => ({ ...prev, error: error }));
    },
    setUserName:(userName)=>{
        setLoginInfo((prev) => ({ ...prev, userName: userName }));
    },
});

  return (
    <LoginStateContext.Provider value={{ ...loginInfo, setLoginInfo }}>
      {children}
    </LoginStateContext.Provider>
  );
};

export default LoginContextProvider;

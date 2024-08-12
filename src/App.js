import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import Login from "./components/LoginPage";
import LoginContextProvider from './context/loginStateContext';

function App() {
  return (
    <LoginContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </LoginContextProvider>
  );
}

export default App;

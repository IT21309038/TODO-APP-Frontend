import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/Auth";
import AppBar from "./components/AppBar";
import Login from "./components/Login";
import Home from "./pages/Home";
import Task from "./pages/Task";

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Login />;
};

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AppBar />
          <Routes>
            <Route path="/" element={<PrivateRoute element={<Home/>}/>}/>
            <Route path="/task" element={<PrivateRoute element={<Task/>}/>}/>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;

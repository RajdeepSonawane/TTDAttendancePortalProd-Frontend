import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, } from "@mui/material";
import './App.css'
import AddEmployee from "./Components/AddEmployee";
import LoginPage from "./Components/LoginPage";
import { useAuth } from "./AuthContext";
import HomePageDashboard from "./Components/HomePage";
import EmployeeList from "./Components/EmployeeList";
import CheckInDashboard from "./Components/CheckIn";
import AppBarHeader from "./Components/AppBar";
import AddLocation from "./Components/AddLocation";
import AttendanceListDashboard from "./Components/ViewAttendance";
import CheckOutDashboard from "./Components/CheckOut";
import CheckOutPreviousDashboard from "./Components/CheckOutPrevious";



const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
 
 

  const isLoginPage: boolean = location.pathname === "/login";


  return (
    <Box sx={{ display: "flex",  flexDirection: "column",minHeight: "100vh", }}>
      {/* Show Sidebar if user is logged in */}
      {isLoggedIn && !isLoginPage && <AppBarHeader/> }

      <Box sx={{ flex: 1, px: 2, pt: 10}}>
        
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" /> : <LoginPage />
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePageDashboard /> : <Navigate to="/login" />
            }
          />
        
          <Route
            path="/add-employee"
            element={
              isLoggedIn ? <AddEmployee /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/employee-list"
            element={
              isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/checkin"
            element={
              isLoggedIn ? <CheckInDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/checkout"
            element={
              isLoggedIn ? <CheckOutDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/attendance-view"
            element={
              isLoggedIn ? < AttendanceListDashboard/> : <Navigate to="/login" />
            }
          />
           <Route
            path="/checkout-previous"
            element={
              isLoggedIn ? <CheckOutPreviousDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/location"
            element={
              isLoggedIn ? <AddLocation /> : <Navigate to="/login" />
            }
          />
          
         
         
        </Routes>
     
        </Box>
    
        </Box>
        
    
  );
};

export default App;


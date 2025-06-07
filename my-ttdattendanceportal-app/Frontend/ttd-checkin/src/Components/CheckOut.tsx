import  { useEffect, useState } from 'react';
import {

  Box,
  Typography,
  TextField,
  Button,

  Paper,
  Divider,
  Autocomplete,
  Snackbar,
} from '@mui/material';
import Grid2 from "@mui/material/Grid2";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from "axios";
import { useFormik } from 'formik';
import { validationSchema } from "../Validations/checkOutValidation";
import { useNavigate } from "react-router-dom";
 interface User {
  userId: string;
  firstName: string;
  lastName:string;
  role:string;
  id:number;
}
interface Location {
  id:number;
  name:string;
}

// Define Employee interface
interface Employee {
    id:number;
    employeeCode: string;
    firstName: string;
    lastName:string;
    contactNumber:string;
    email: string;
    designation:string;
    role: string;
}

interface Attendance{
  checkInDate:string;

}


const CheckOutDashboard = () => {


 

const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 const [employees, setEmployees] = useState<Employee|null>(null);
const [locations, setLocations] = useState<Location[]>([]);
const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
const [UserAttendance, setUserAttendance] = useState<Attendance | null>(null);
const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
 const token = localStorage.getItem("token");

  const [time, setTime] = useState(new Date());
  const now = new Date();
  const dayNumber = now.getDate(); // 30
  const dayName = now.toLocaleDateString('en-IN', { weekday: 'short' }); // Fri
  const monthYear = now.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); // May 2025

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // update every second
    return () => clearInterval(timer); // cleanup
  }, []);

  const hours = time.getHours();
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const period = hours >= 12 ? 'PM' : 'AM';


  useEffect(() => {
          const fetchemployeedetails=async()=>{
          try{
          // Fetch users from the backend
          const id=user?.id
          const response=await axios.get<Employee>(`${API_BASE_URL}/User/user-list/${id}`);
         
          setEmployees(response.data);
              }
          catch(error) {
                  console.error("Error fetching user:", error);
              };
          }
          fetchemployeedetails()
      }, []);

      useEffect(() => {
        const fetchlocation=async()=>{
        try{
        // Fetch users from the backend
        const response=await axios.get<Location[]>(`${API_BASE_URL}/Location/location-list`);
       
        setLocations(response.data);
            }
        catch(error) {
                console.error("Error fetching users:", error);
            };
        }
        fetchlocation()
    }, []);


    useEffect(() => {
        const fetchuserattendance=async()=>{
        try{

          const id=user?.id;
        // Fetch users from the backend
        const response=await axios.get<Attendance>(`${API_BASE_URL}/Attendance/user-attendence/${id}`);
        console.log(response.data)
        setUserAttendance(response.data);
            }
        catch(error) {
                console.error("Error fetching users Attendance:", error);
            };
        }
        fetchuserattendance()
    }, []);

    const formik=useFormik({
    initialValues:{
     
      checkOutLocation:0,
      checkOutOtherLocation:"",
      activity:""
    },
    validationSchema:validationSchema,
    onSubmit:async (values,{setSubmitting,resetForm}) => {
      try {
        
        const response = await axios.put(
          `${API_BASE_URL}/Attendance/check-out`,
          values,
          {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            }
          }  
        );
        if (response.status === 200) {
          setSuccessMessage("CheckOut Done successfully!");
          setOpenSnackbar(true);
            // Reset the form
          resetForm();
          navigate("/");
        }
  
       
        
      } catch (error) {
        console.error("Error doing CheckIn:", error);
       
      }finally {
        setSubmitting(false);
      }
    }
  })

    const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
    
  return (
    <Box sx={{ p: 2,mb:8}}>
      <Paper sx={{ p: 2, mb:8}} >
      <Grid2 container spacing={2} wrap="wrap">

        {/* Date Panel */}
        <Grid2 size={{ xs: 12, md: 4,}}>
          <Paper elevation={3}
      sx={{
        borderRadius: 2,
        padding: 2,
        backgroundColor: '#fff',
      
       }}>
             <Typography variant="body1" gutterBottom color="primary">Date</Typography>
             <Divider></Divider>
            <Typography variant="h4" sx={{ color: 'darkblue' }} fontWeight="bold">{dayNumber}</Typography>
            <Typography variant="h4" sx={{ textDecoration: 'underline', color: 'darkblue' }} fontWeight="bold">{monthYear}</Typography>
            <Typography variant="h4" sx={{ color: 'darkblue' }} fontWeight="bold">{dayName}</Typography>
            <Box mt={2}>
             {UserAttendance?.checkInDate && (
                <Typography fontWeight="bold">
                  Hours Worked: {
                    (() => {
                      const checkIn = new Date(UserAttendance.checkInDate);
                      const now = new Date();
                      const diffMs = now.getTime() - checkIn.getTime();

                      const hours = Math.floor(diffMs / (1000 * 60 * 60));
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    })()
                  }
                </Typography>
              )}
             
            </Box>
          </Paper>
        </Grid2>

        {/* Check-In/Check-Out Panel */}
        <Grid2 size={{ xs: 12, md: 4}}>
          <Paper elevation={3}
      sx={{
        borderRadius: 1,
        padding: 2,
        backgroundColor: '#fff',      
 }}>
            <Typography variant="body1" gutterBottom color="primary">CheckIn-CheckOut</Typography>
             <Divider></Divider>
            <form onSubmit={formik.handleSubmit} >
            <TextField 
            size="small" 
            fullWidth 
            label="Employee Code" 
            value={employees?.employeeCode} 
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
             />
         
           

        <Autocomplete
                          options={locations} 
                          getOptionLabel={(option) => option.name}
                          value={selectedLocation} 
                          onChange={(_e, newValue) => {
                            setSelectedLocation(newValue); // Store only the name for display
                            formik.setFieldValue("checkOutLocation", newValue?.id || 0);
                            
                          }}
                          renderInput={(params) => (
                          <TextField
                          {...params} 
                          label="Select Location" 
                          fullWidth
                          variant="outlined" 
                          error={formik.touched.checkOutLocation && Boolean(formik.errors.checkOutLocation)}
                          helperText={formik.touched.checkOutLocation && formik.errors.checkOutLocation}
                          />
                          )}
                          
                        />
                        {selectedLocation?.id === 1 && (
                            <TextField
                              fullWidth
                              size="small"
                              margin="normal"
                              name="checkOutOtherLocation"
                              label="Enter Other Location"
                              value={formik.values.checkOutOtherLocation}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.checkOutOtherLocation && Boolean(formik.errors.checkOutOtherLocation)}
                              helperText={formik.touched.checkOutOtherLocation && formik.errors.checkOutOtherLocation}
                            />
                          )}
                        <TextField
  fullWidth
  size="small"
  margin="normal"
  name="activity"
  label={
    <Box display="flex" alignItems="center">
      <ChatBubbleOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
      Work Done <Typography variant="caption" color="error" sx={{ ml: 0.5 }}>(Max - 1000 char)</Typography>
    </Box>
  }
  multiline
  rows={4}
  inputProps={{ maxLength: 1000 }}
  value={formik.values.activity}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={formik.touched.activity && Boolean(formik.errors.activity)}
  helperText={formik.touched.activity && formik.errors.activity}
/>



         
            <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: '#4fc3f7' }} type="submit" disabled={formik.isSubmitting}>
              Check-Out
            </Button>
            </form>
          </Paper>
         
        </Grid2>
         
         

        {/* Time Panel */}
        <Grid2 size={{ xs: 12, md: 4}}>
          <Paper elevation={3}
      sx={{
        borderRadius: 2,
        padding: 2,
        backgroundColor: '#fff',
       
       }}>
          <Typography variant="body1" gutterBottom color="primary">Time</Typography>
           <Divider></Divider>
            <Typography variant="h4" sx={{ color: 'darkblue' }} fontWeight="bold">{formattedHour}</Typography>
            <Typography variant="h4" sx={{ textDecoration: 'underline',color: 'darkblue'}}> {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Typography>
            <Typography variant="h4" sx={{ color: 'darkblue' }} fontWeight="bold">{period}</Typography>
            <Box mt={2}>
              {UserAttendance?.checkInDate &&
                  <Typography>
                    <strong>Check-In Time:</strong> {new Date(UserAttendance.checkInDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </Typography>
                }
  
            </Box>
          </Paper>
        </Grid2>

      </Grid2>
      </Paper>
      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Box>
  );
};

export default CheckOutDashboard;

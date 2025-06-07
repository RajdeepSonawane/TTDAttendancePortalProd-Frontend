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
import axios from "axios";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { validationSchema } from "../Validations/checkInValidation";

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


const CheckInDashboard = () => {


 

const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 const [employees, setEmployees] = useState<Employee|null>(null);
const [locations, setLocations] = useState<Location[]>([]);
const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);


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
  const checkIfAlreadyCheckedIn = async () => {
    try {
            const id = user?.id;
            const response = await axios.get(`${API_BASE_URL}/Attendance/user-attendence/${id}`);
            const attendance = response.data;

            if (attendance && attendance.checkInDate){
              const checkInDate = new Date(attendance.checkInDate);
              const today = new Date();
              
              const isSameDay =
                checkInDate.getDate() === today.getDate() &&
                checkInDate.getMonth() === today.getMonth() &&
                checkInDate.getFullYear() === today.getFullYear();

              if (isSameDay && !attendance.checkOutDate) {
                // Checked in today but not yet checked out
                navigate("/checkout");
              }
              else if(!isSameDay && !attendance.checkOutDate && attendance.status=='Partial'){
                navigate("/checkout-previous")
              }
            }
        }catch (error) {
            console.error("Error checking attendance:", error);
            }
        };
          checkIfAlreadyCheckedIn();
        }, []);


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

    const formik=useFormik({
    initialValues:{
     
      checkInLocation:0,
      checkInOtherLocation:"",
    
    },
    validationSchema:validationSchema,
    onSubmit:async (values,{setSubmitting,resetForm}) => {
      try {
        
        const response = await axios.post(
          `${API_BASE_URL}/Attendance/check-in`,
          values,
          {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            }
          }  
        );
        if (response.status === 200) {
          setSuccessMessage("CheckIn Done successfully!");
          setOpenSnackbar(true);
          navigate("/checkout");
        
          resetForm();
          setSelectedLocation(null);
        }
  
        
      } catch (error) {
        let message = "Something went wrong!";

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            message = error.response.data;
          }
        }

        setErrorMessage(message);
        setOpenErrorSnackbar(true);
       
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
              <Typography fontWeight="bold">Hours Worked: --:--</Typography>
             
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
                    formik.setFieldValue("checkInLocation", newValue?.id || 0);
                    
                  }}
                  renderInput={(params) => (
                  <TextField
                  {...params} 
                  label="Select Location" 
                  fullWidth
                  variant="outlined" 
                  error={formik.touched.checkInLocation && Boolean(formik.errors.checkInLocation)}
                  helperText={formik.touched.checkInLocation && formik.errors.checkInLocation}
                  />
                  )}
                  
                />
                {selectedLocation?.id === 1 && (
                    <TextField
                      fullWidth
                      size="small"
                      margin="normal"
                      name="checkInOtherLocation"
                      label="Enter Other Location"
                      value={formik.values.checkInOtherLocation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.checkInOtherLocation && Boolean(formik.errors.checkInOtherLocation)}
                      helperText={formik.touched.checkInOtherLocation && formik.errors.checkInOtherLocation}
                    />
                  )}



         
            <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: '#4fc3f7' }} type="submit" disabled={formik.isSubmitting}>
              Check-In
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
              <Typography fontWeight="bold">
                Check-In Time: <span style={{ color: 'red' }}>--:--</span>
              </Typography>
              
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
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenErrorSnackbar(false)}
        message={errorMessage}
      />
    </Box>
  );
};

export default CheckInDashboard;

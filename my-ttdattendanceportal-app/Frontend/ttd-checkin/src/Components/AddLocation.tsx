import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,

  Snackbar,
 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid2 from "@mui/material/Grid2";

import { useFormik } from "formik";
import { validationSchema } from "../Validations/locationValidation";

interface Location {
  id:number;
  name:string;
}

// Define the expected user data structure////
interface User {
  userId: string;
  firstName: string;
  lastName:string;
  role:string;
  id:number;
}

const AddLocation: React.FC = () => {
  
  const navigate = useNavigate();
  const [selectedlocation, setSelectedlocation] = useState<Location[]>([]);

  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  

  // Get user data from localStorage
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  
    useEffect(() => {
      if (!user || user.role !== "Super Admin") {
        navigate("/");
      }
      else {
        setLoading(false); // Show content only if user is super_admin
      }
    }, [user, navigate]);
   
  
      useEffect(() => {
              const fetchlocation=async()=>{
              try{
              // Fetch users from the backend
              const response=await axios.get<Location[]>(`${API_BASE_URL}/Location/location-list`);
              console.log(response.data)
              setSelectedlocation(response.data);
                  }
              catch(error) {
                      console.error("Error fetching users:", error);
                  };
              }
              fetchlocation()
          }, []);
  


  const formik=useFormik({
    initialValues:{
      name: "",
    },
    validationSchema:validationSchema,
    onSubmit:async (values,{setSubmitting,resetForm}) => {
      try {
        setError(""); // Clear previous errors
        const response = await axios.post(
          `${API_BASE_URL}/Location/add-location`,
          values,
          {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in headers
            }
          }  
        );
        if (response.status === 201) {
          setSuccessMessage("Location added successfully!");
          setOpenSnackbar(true);
        
        }
  
        // Reset the form
        resetForm();
        
      } catch (error) {
        console.error("Error adding Location:", error);
        setError("Failed to add Location. Please try again.");
      }finally {
        setSubmitting(false);
      }
    }
  })





  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  return (
    <Box sx={{ p: 2,mb:8,}}>
       {loading ? (
      <Typography>Loading...</Typography>
    ) : (
       <Paper  elevation={3} sx={{ p: 2, mb:8,overflowY: 'auto',maxHeight: '80vh' }}>
      <Typography variant="h6" mb={2}>
        Add Location
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit} >
      <Grid2 container spacing={2} >
      <Grid2 size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="name"
          label="Location Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          required
        />
        </Grid2>
        <Box >
        <Button variant="contained" color="primary" type="submit" disabled={formik.isSubmitting}>
          Add
        </Button>
        </Box>
        </Grid2>
        
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table sx={{ width: "100%" }} aria-label="accounts table">
                        
                        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                          <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Location Name</TableCell>
                           
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedlocation.map((loc, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{loc.name}</TableCell>
                              
    
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
        
          
         

         
        
        
       
      </form>
      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
      </Paper>
    )}
    </Box>
  );
};

export default AddLocation;

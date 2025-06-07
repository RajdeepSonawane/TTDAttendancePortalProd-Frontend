import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography,
    TextField,
    Button,
    Box,
    MenuItem,
    Paper,
    Avatar,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validationSchema } from "../Validations/employeeValidation";


// Define the expected user data structure
interface User {
  userId: string;
  firstName: string;
  lastName:string;
  role:string;
  id:number;
}

const AddEmployee: React.FC = () => {
    const navigate = useNavigate();
    const roles: string[] = ["Admin", "Super Admin"];

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
    //const [imagePreview, setImagePreview] = useState<string | null>(null);
   //const [selectedFile, setSelectedFile] = useState<File | null>(null);

    //const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //const file = e.target.files?.[0];
    //if (file) {
    //  setImagePreview(URL.createObjectURL(file));
    //  setSelectedFile(file);
    //}
     //};




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
  

   // Formik Hook
  const formik = useFormik({
    initialValues: {
      //employeeImage:"",
      employeeCode: "",
      firstName: "",
      middleName: "",
      lastName: "",
      contactNumber: "",
      currentAddress: "",
      email: "",
      password: "",
      designation: "",
      role: "",
      DOB:"",
      DOJ:"",
      yearOfExp:0,
      bloodGroup:""
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {

        
        try {
            const formData = new FormData();
        formData.append("employeeCode", values.employeeCode);
        formData.append("firstName", values.firstName);
        formData.append("middleName", values.middleName);
        formData.append("lastName", values.lastName);
        formData.append("contactNumber", values.contactNumber);
        formData.append("currentAddress", values.currentAddress);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("designation", values.designation);
        formData.append("role", values.role);
        formData.append("DOB", values.DOB);
        formData.append("DOJ", values.DOJ);
        formData.append("yearOfExp", values.yearOfExp.toString());
        formData.append("bloodGroup", values.bloodGroup);

       // if (selectedFile) {
         //   formData.append("employeeImage", selectedFile);
         //   }
           
          const response = await axios.post(`${API_BASE_URL}/User/add-user`,
           formData,
           {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },  
        });
          console.log("Employee added successfully:", response.data);
          navigate("/employee-list");
          resetForm();
        } catch (error: any) {
  console.error("Error adding employee:", error.response?.data || error.message);
}
 finally {
          setSubmitting(false);
        }
      },
    });
 
    return (
        <Box sx={{ p: 2,mb:8,}}>
             {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
            <Paper elevation={3} sx={{ p: 2, mb:8,overflowY: 'auto',maxHeight: '80vh' }}>     
                <Typography variant="h6" className="typography" mb={1}>
                                Add Employee
                </Typography>
               

                                <form onSubmit={formik.handleSubmit} className="form-container">
                                    <Box textAlign="center">
                                            {/* Circle Avatar Preview (not clickable) */}
                                            <Avatar
                                                //src={imagePreview || undefined}
                                                sx={{
                                                width: 100,
                                                height: 100,
                                                margin: 'auto',
                                                boxShadow: 3,
                                                }}
                                            />

                                            {/* MUI Button acting as file input trigger */}
                                            <label htmlFor="upload-photo">
                                                <input
                                                accept="image/*"
                                                id="upload-photo"
                                                name="employeeImage"
                                                type="file"
                                                hidden
                                                //onChange={handleFileChange}
                                                />
                                                <Button disabled variant="text" component="span" sx={{ }}>
                                                Choose a File...
                                                </Button>
                                            </label>
                                        </Box>
                                   
                                    <Grid2 container spacing={2} >
                                        
                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                size="small" 
                                                label="Employee Code"
                                                name="employeeCode"
                                                value={formik.values.employeeCode}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.employeeCode && Boolean(formik.errors.employeeCode)}
                                                helperText={formik.touched.employeeCode && formik.errors.employeeCode}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Designation"
                                                name="designation"
                                                size="small" 
                                                value={formik.values.designation}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.designation && Boolean(formik.errors.designation)}
                                                helperText={formik.touched.designation && formik.errors.designation}
                                           
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3}}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                size="small" 
                                                value={formik.values.firstName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                                helperText={formik.touched.firstName && formik.errors.firstName}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3}}>
                                            <TextField
                                                fullWidth
                                                label="Middle Name"
                                                name="middleName"
                                                size="small" 
                                                value={formik.values.middleName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                                                helperText={formik.touched.middleName && formik.errors.middleName}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3}}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                size="small" 
                                                value={formik.values.lastName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                                helperText={formik.touched.lastName && formik.errors.lastName}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Date Of Birth"
                                                type="date"
                                                name="DOB"
                                                size="small" 
                                                value={formik.values.DOB}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                InputLabelProps={{ shrink: true }} 
                                                error={formik.touched.DOB && Boolean(formik.errors.DOB)}
                                                helperText={formik.touched.DOB && formik.errors.DOB}
                                            />
                                        </Grid2>

                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Date Of Joining"
                                                type="date"
                                                name="DOJ"
                                                size="small" 
                                                value={formik.values.DOJ}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                InputLabelProps={{ shrink: true }} 
                                                error={formik.touched.DOJ && Boolean(formik.errors.DOJ)}
                                                helperText={formik.touched.DOJ && formik.errors.DOJ}
                                            />
                                        </Grid2>
                                        
                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                label="Contact Number"
                                                name="contactNumber"
                                                size="small" 
                                                value={formik.values.contactNumber}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                                                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                               fullWidth
                                               label="Current Address"
                                               name="currentAddress"
                                               size="small" 
                                               value={formik.values.currentAddress}
                                               onChange={formik.handleChange}
                                               onBlur={formik.handleBlur}
                                               error={formik.touched.currentAddress && Boolean(formik.errors.currentAddress)}
                                               helperText={formik.touched.currentAddress && formik.errors.currentAddress}
                                               
                                                
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                size="small" 
                                                label="Year Of Experience"
                                                name="yearOfExp"
                                                value={formik.values.yearOfExp}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.yearOfExp && Boolean(formik.errors.yearOfExp)}
                                                helperText={formik.touched.yearOfExp && formik.errors.yearOfExp}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                size="small" 
                                                label="Blood Group"
                                                name="bloodGroup"
                                                value={formik.values.bloodGroup}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
                                                helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
                                            />
                                        </Grid2>
                                        <Grid2 size={{xs: 12, md: 3}}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                type="email"
                                                size="small" 
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 12, md: 3}}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                name="password"
                                                type="password"
                                                size="small" 
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                         
                                            />
                                        </Grid2>
                                
                                        <Grid2 size={{ xs: 12, md: 3}}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Role"
                                                name="role"
                                                size="small" 
                                                value={formik.values.role}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.role && Boolean(formik.errors.role)}
                                                helperText={formik.touched.role && formik.errors.role}
                                            >
                                            
                                                {roles.map((role) => (
                                                    <MenuItem key={role} value={role}>
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid2>
                                    </Grid2>
                                
                                
                                    {/* Submit Button */}
                            <Box mt={2}>
                                <Button variant="contained" color="primary" type="submit" disabled={formik.isSubmitting}>
                                        Submit
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                )}        
        </Box>
    );
};
export default AddEmployee;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, TableContainer } from "@mui/material";

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



const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        const fetchemployee=async()=>{
        try{
        // Fetch users from the backend
        const response=await axios.get<Employee[]>(`${API_BASE_URL}/User/user-list`);
        console.log(response.data)
        setEmployees(response.data);
            }
        catch(error) {
                console.error("Error fetching users:", error);
            };
        }
        fetchemployee()
    }, []);

    return (
        <Box sx={{ p: 2,mb:8,}}>
        <Paper elevation={3} sx={{ p: 2, mb:8,overflowY: 'auto',maxHeight: '80vh' }} >
            <Typography variant="h6" className="typography">
                Employee List
            </Typography>
            <TableContainer component={Paper}sx={{ flex: 1, overflowX:"auto",marginTop:2 }}>
                <Table stickyHeader>
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                        <TableCell>Employee Code</TableCell>
                        <TableCell>Name</TableCell>
                         <TableCell>Contact No.</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((emp) => (
                        <TableRow key={emp.id}>
                            <TableCell>{emp.employeeCode}</TableCell>
                         <TableCell>{emp.firstName + " " + emp.lastName}</TableCell>
                          <TableCell>{emp.contactNumber}</TableCell>
                            <TableCell>{emp.email}</TableCell>
                               <TableCell>{emp.designation}</TableCell>
                            <TableCell>{emp.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Paper>
        </Box>
    );
};

export default EmployeeList;

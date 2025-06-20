// InvoiceList.tsx
import React, { useEffect, useState } from "react";

import axios from "axios";
import { format } from "date-fns";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button,  TableContainer, Box, TextField,TablePagination, FormControl, InputLabel, MenuItem, Select, Autocomplete } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useFormik } from "formik";
import { validationSchema } from "../Validations/viewAttendance";

// Define Attendance interface
interface Attendance {
    employeeCode:string;
    firstName: string;
    lastName: string;
    inDate: Date;
    inTime:string;
    inLocation:string;
    outTime:string;
    outLocation:string;
    status:string;
    activity:string;
    hoursWorked: string;
}

// Define Employee interface
interface Employee {
    firstName: string;
    lastName:string;

}

interface User {
  userId: string;
  firstName: string;
  lastName:string;
  role:string;
  id:number;
}

const AttendanceListDashboard: React.FC = () => {
  const[search,setsearch]=useState<string>("");
  const[selectedname,setselectedname]=useState<Employee>();
  const[attendancelist,setattendancelist]=useState<Attendance[]>([]);
  //const[selectedstatus,setselectedstatus]=useState<string>("");
  const status:string[]=["Present","Absent","Partial"];
  const [page, setPage] = useState(0); // Current page
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Items per page
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  const role=user?.role


  useEffect(() => {

           
            if (role === "Super Admin") {
                const fetchemployeename = async () => {
                  try {
                    const response = await axios.get<Employee[]>(`${API_BASE_URL}/User/user-name`);
                  
                    setEmployees(response.data);
                  } catch (error) {
                    console.error("Error fetching user:", error);
                  }
                };
                fetchemployeename();
              }
            }, []);
  
const formik=useFormik({
    initialValues:{
    
      fromDate:"",
      toDate:""
    
    },
        validationSchema:validationSchema,
    onSubmit:async (values,{setSubmitting,resetForm}) => {
      try {
        
        const response = await axios.post(
          `${API_BASE_URL}/Attendance/attendance-view/`,
          values,
          {
            headers: {
                Authorization: `Bearer ${token}`,  
            }
          }  
        );
        if (response.status === 200) {
          setattendancelist(response.data);
          
        
          resetForm();
        
        }
  
        
      } catch (error) {
        console.error("Error fetching user:", error);
       
      }finally {
        setSubmitting(false);
      }
    }
  })
   
  
    const filteredattendance = attendancelist.filter((att) => {
      const matchesSearch = search ? att.status?.includes(search) : true;
      const matchesName=selectedname ? `${att.firstName} ${att.lastName}`.includes(`${selectedname.firstName} ${selectedname.lastName}`) : true;

      return matchesSearch && matchesName;
    });

 

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAttendance = filteredattendance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  

  return (
    <Box sx={{mb:8}}>
    <Paper sx={{ p: 2, mb:8}}>
     <Typography variant="h6" color="blue" marginBottom={2}>
          Attendance View
        </Typography>
        <form onSubmit={formik.handleSubmit} >
        <Grid2 container spacing={2} >
           <Grid2 size={{ xs: 12, md: 2 }}>
        {role === "Super Admin" && (
          <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 1 }}>
        <Autocomplete
          options={employees} 
          
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={employees.find(
            (emp) =>
              emp.firstName === selectedname?.firstName &&
              emp.lastName === selectedname?.lastName
          ) || null}
          onChange={(_e, newValue) => {
                    setselectedname(newValue?? undefined); // Store only the name for display
                    
                  }}
        
          renderInput={(params) => <TextField {...params} label="Search"  variant="outlined" />}
          sx={{ width: 300 }}
        />
      </Box>
        )}
      </Grid2>
        <Grid2 size={{ xs: 12, md: 2 }}>
          {/* Search Bar */}
            <FormControl fullWidth>
            <InputLabel>Select Status</InputLabel>
            <Select
             
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            >
                {status.map((state, index) => (
                  <MenuItem key={index} value={state}>
                    {state}
                  </MenuItem>
                ))}
            </Select>
            </FormControl>
          </Grid2>
          <Grid2  size={{ xs: 12, md: 2 }}>
                <TextField
                                      
                    label="fromDate"
                    type="date"
                    name="fromDate"
                    value={formik.values.fromDate}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    />
            </Grid2>
            <Grid2  size={{ xs: 12, md: 2 }}>
                <TextField
                                      
                    label="toDate"
                    type="date"
                    name="toDate"
                    value={formik.values.toDate}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    />
            </Grid2>
            <Grid2  size={{ xs: 12, md: 2 }}>
            <Button variant="contained" sx={{ mt: 2, backgroundColor: '#4fc3f7' }} type="submit" disabled={formik.isSubmitting}>
                Search
            </Button>
          </Grid2>
            </Grid2>
              </form>
           
          
    <TableContainer component={Paper}sx={{ flex: 1, overflow: "auto",marginTop:2 }}>
      <Table stickyHeader>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>Employee Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>InDate</TableCell>
            <TableCell>InTime</TableCell>
            <TableCell>InLocation</TableCell>
            <TableCell>OutTime</TableCell>
            <TableCell>OutLocation</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Activity</TableCell>
            <TableCell>Hours Worked</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {paginatedAttendance.map((attendance,index) => (
         <TableRow key={index}>
            <TableCell>{attendance.employeeCode}</TableCell>
            <TableCell>{`${attendance.firstName} ${attendance.lastName}`}</TableCell>
            <TableCell>{ format(new Date(attendance.inDate), "dd/MM/yyyy")}</TableCell>
            <TableCell>{attendance.inTime}</TableCell>
            <TableCell>{attendance.inLocation}</TableCell>
            <TableCell>{attendance.outTime}</TableCell>
            <TableCell>{attendance.outLocation}</TableCell>
            <TableCell>{attendance.status}</TableCell>
            <TableCell>{attendance.activity}</TableCell>
            <TableCell>{attendance.hoursWorked}</TableCell>
            </TableRow>
          ))}
         </TableBody>
      </Table>
      </TableContainer>
      {/* Pagination Component */}
      <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={filteredattendance.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </Box>
  );
};

export default AttendanceListDashboard;

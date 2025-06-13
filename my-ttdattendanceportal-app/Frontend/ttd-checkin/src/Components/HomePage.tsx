import  { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid2 from "@mui/material/Grid2";
import LockIcon from '@mui/icons-material/Lock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CakeIcon from '@mui/icons-material/Cake';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import axios from 'axios';

// Define Employee interface
interface Employee {
    id:number;
    //employeeImage:string;
    employeeCode: string;
    firstName: string;
    middleName:string;
    lastName:string;
    bloodGroup:string;
    yearOfExp:string;
    designation:string;
    dob:string;
    doj:string;
}

 interface User {
  userId: string;
  firstName: string;
  lastName:string;
  role:string;
  id:number;
}

const HomePageDashboard=()=> {
  const navigate = useNavigate();
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const [employees, setEmployees] = useState<Employee|null>(null);
   


  useEffect(() => {
            const fetchemployeedetails=async()=>{
              
            try{
            // Fetch users from the backend
            const id=user?.id
            const response=await axios.get<Employee>(`${API_BASE_URL}/User/user-list/${id}`);
           console.log(response.data)
            setEmployees(response.data);
                }
            catch(error) {
                    console.error("Error fetching user:", error);
                };
            }
            fetchemployeedetails()
        }, []);


        

        const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;
      };

      

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh',overflow: 'hidden',display: 'flex',flexDirection: 'column'}} >
     
        
       
     

        {/* Profile + Thought */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
    <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 3}}>
            
              <Paper sx={{ p: 1 }}>
                <Avatar  sx={{ width: 100, height: 130, mx: 'auto', mb: 2 }}/>
                <Typography variant="h6" color="primary">
                   <strong>{employees?.firstName+" "+employees?.middleName+" "+employees?.lastName} </strong>
                </Typography>
                <Box mt={2} textAlign="left">
                  <Typography><strong>Date of Birth:</strong>{employees?.dob?formatDate(employees?.dob):'N/A'}</Typography>
                  <Typography><strong>Blood Group:</strong> {employees?.bloodGroup}</Typography>
                  
                  <Typography><strong>Date Of Joining:</strong>{employees?.dob?formatDate(employees?.doj):'N/A'}</Typography>
                  <Typography><strong>Designation:</strong>{employees?.designation}</Typography>
                  
                  <Typography><strong>Year Of Service:</strong> {employees?.yearOfExp} Years</Typography>
                </Box>
             </Paper>
             <Paper sx={{ p: 1, mt: 1 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  🏆 Employee of the Month
                </Typography>
                <TextField
                 
                  value="Shrikant Jamadar"
                  fullWidth
                  disabled
                  variant="outlined"
                />
              </Paper>
           
          </Grid2>

          

          <Grid2 size={{ xs: 12, md: 9 }}>
              <Paper sx={{ p: 2, mb: 2 }}>
              
                <Typography color="primary" variant="h6"align="left" sx={{ borderBottom: '1px solid #eee' }}>
                  Thought Of The Day
                </Typography>
                <Paper elevation={5}>
                <Typography variant="body1" align="center" sx={{ fontStyle: 'italic' }} >
                  सततं प्रयत्नशीलः सदा विजयशाली भवति। <br />
                  तेजस्वी कार्यकर्ता भवतः कार्ये सफलता निश्चितम्॥
                </Typography>
                </Paper>
                <Paper sx={{ p: 1, mb:1 ,mt:1 }} elevation={5} >
                <Typography variant="body2" mt={2} align="center">
                  जो नियमितपणे खाणे, झोपणे, उपभोग घेणे आणि काम करणे या सर्वांची लावतो,
                  तो योगसाधनेने सर्व भौतिक क्लेशांचा नाश करू शकतो.
                </Typography>
                </Paper>
              </Paper>
      
        
        <Paper sx={{ p: 2, mb: 2 }}>
           <Typography color="primary" variant="body1" align="center" sx={{ fontStyle: 'bold' }}>
                 Employee Dashboard
                </Typography>
        {/* Dashboard Buttons */}
        <Grid2 container  mt={4}>
          
          {[
            { label: 'CheckIn-CheckOut', icon: <LockIcon/> ,route: '/checkin' },
            { label: 'Attendance View', icon: <WorkHistoryIcon />,route: '/checkIn-checkOut' },
            { label: 'Annual Holidays', icon: <CalendarMonthIcon />,route: '/checkIn-checkOut' },
            { label: 'Salary Slip', icon: <ReceiptIcon />,route: '/checkIn-checkOut' },
            { label: 'Change Password', icon: <VpnKeyIcon />,route: '/checkIn-checkOut' },
            { label: 'Out Of Office', icon: <FlightTakeoffIcon />,route: '/checkIn-checkOut' },
            { label: 'Take A Leave', icon: <FlightTakeoffIcon />,route: '/checkIn-checkOut' },
            { label: 'Birthday List', icon: <CakeIcon />,route: '/checkIn-checkOut' },
          ].map((item, idx) => (
            <Grid2 size={{ xs: 12, md: 3,sm:6 }} key={idx}>
              <Paper
                elevation={1}
                sx={{
                  textAlign: 'center',
                  p: 2,
                  
                  border: '1px solid #ddd',
                  backgroundColor: '#fafafa',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 3,
                    backgroundColor: '#f0f0f0',
                  },
                }}
                 onClick={() => navigate(item.route)}
              >
                <Box fontSize="2rem" color="primary.main">
                  {item.icon}
                </Box>
                <Typography mt={1} variant="body1">
                  {item.label}
                </Typography>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
        </Paper>
      </Grid2>
    </Grid2>
  </Box>
  </Box>
  
  );
};
export default HomePageDashboard

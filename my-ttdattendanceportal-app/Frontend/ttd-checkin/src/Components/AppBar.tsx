import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import {

    Typography,
 
    Toolbar,
    AppBar,
 
    Button,
    Box,
    Menu,
    MenuItem,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";


interface User {
  userId: string;
  firstName: string;
  lastName:string;
  role:string;
  id:number;
}

const AppBarHeader: React.FC = () => {


  const navigate = useNavigate();
  const { logout } = useAuth();
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  const [homeAnchor, setHomeAnchor] = useState<null | HTMLElement>(null);
  const [employeeAnchor, setEmployeeAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true on small screens



const toggleDrawer = (open: boolean) => () => {
  setDrawerOpen(open);
};

const handleNavigate = (path: string) => {
    navigate(path);
  
  };


   const handleHomeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHomeAnchor(event.currentTarget);
  };


const handleEmployeeClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmployeeAnchor(event.currentTarget);
  };


  const handleCloseAll = () => {
    setHomeAnchor(null);
    setEmployeeAnchor(null);
  };

  const drawerContent = (
  <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
    <List>
    <ListItem disablePadding>
  <ListItemButton onClick={() => handleNavigate("/")}>
    <ListItemText primary="Dashboard" />
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
  <ListItemButton onClick={() => handleNavigate("/add-employee")}>
    <ListItemText primary="Add Employee" />
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
  <ListItemButton onClick={() => handleNavigate("/employee-list")}>
    <ListItemText primary="Employee List" />
  </ListItemButton>
</ListItem>

<ListItem disablePadding>
  <ListItemButton onClick={() => handleNavigate("/location")}>
    <ListItemText primary="Location" />
  </ListItemButton>
</ListItem>

<Divider />

<ListItem disablePadding>
  <ListItemButton onClick={logout}>
    <ListItemText primary="Logout" />
  </ListItemButton>
</ListItem>

    </List>
  </Box>
);


    return (
      

        <AppBar
                position="fixed"
                elevation={0}
                sx={{
                  bgcolor: "white",
                  color: "black",
                
                  borderBottom: "1px solid #ddd",
                }}
              ><Toolbar sx={{display: "flex", justifyContent: "space-between", px: 2 }}>
  {isMobile ? (
    <>
      <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
        <Typography variant="body2" >
          Welcome, <strong>{user?.firstName + " " + user?.lastName}</strong>
        </Typography>
      </Box>
    </>
  ) : (
    <>
      <Box sx={{ mx: "auto", textAlign: "center" }}>
        <Typography variant="body1">
          Welcome, <strong>{user?.firstName + " " + user?.lastName} </strong>
        </Typography>
        <Typography variant="body2">Login: 08 June 2025 11:08:52 AM</Typography>
        <Typography variant="body2">Last Login: 08 June 2025 08:08:52 AM</Typography>
      </Box>

      <Box>
        <Button
          onClick={handleHomeClick}
          sx={{
            bgcolor: "transparent",
            textDecoration: "underline",
            color: "darkblue",
            textTransform: "none",
          }}
        >
          Home
        </Button>
        <Menu
          anchorEl={homeAnchor}
          open={Boolean(homeAnchor)}
          onClose={handleCloseAll}
        >
          <MenuItem onClick={() => handleNavigate("/")}>Dashboard</MenuItem>
          <MenuItem onMouseEnter={handleEmployeeClick}>Employee ▸</MenuItem>
          <MenuItem onClick={() => handleNavigate("/location")}>Location</MenuItem>
        </Menu>

        <Menu
          anchorEl={employeeAnchor}
          open={Boolean(employeeAnchor)}
          onClose={handleCloseAll}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={() => handleNavigate("/add-employee")}>Add Employee</MenuItem>
          <MenuItem onClick={() => handleNavigate("/employee-list")}>Employee List</MenuItem>
        </Menu>

        <Button
          variant="contained"
          size="small"
          onClick={logout}
          sx={{ ml: 2, bgcolor: "orange", color: "#fff" }}
          endIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>
    </>
  )}
</Toolbar>

              </AppBar>

              
          );
};
export default AppBarHeader  
import React, { createContext, useContext, useState,  useEffect, type ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

interface User {
  userId: string;
  firstName: string;
  lastName:string;
  role:string;
  id:number;
}

// Define AuthContext types
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
}

interface TokenPayload {
  exp: number; // Expiration timestamp
  UserId: string;
  FirstName: string;
  LastName:string;
  Role:string;
  Id:string;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  
  const isLoggedIn = !!token;



 const login = (jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    try {
      const decoded: TokenPayload = jwtDecode(jwtToken);
      const userData = { userId: decoded.UserId, firstName: decoded.FirstName,lastName: decoded.LastName,role: decoded.Role,id: Number(decoded.Id)  };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

// Logout function
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setToken(null);
  setUser(null);
};

// Validate token on initial load
useEffect(() => {
  if (token) {
    try {
      const decoded: TokenPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (decoded.exp < currentTime) {
        logout(); // Token expired
      }
      else {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : { userId: decoded.UserId, firstName: decoded.FirstName,lastName: decoded.LastName,role: decoded.Role,id:Number(decoded.Id) });
      }
    } catch (error) {
      logout(); // Invalid token
    }
  }
}, [token]);

  return (
    <AuthContext.Provider value={{  isLoggedIn, token,  user,login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};




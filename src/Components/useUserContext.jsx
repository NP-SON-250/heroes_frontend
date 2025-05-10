// Components/useUserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserRole(parsedUser.role);
      }
      setLoading(false);
    }, []);
  
    return (
      <UserContext.Provider value={{ user, setUser, userRole, loading }}>
        {children}
      </UserContext.Provider>
    );
  };
  

export const useUserContext = () => useContext(UserContext);

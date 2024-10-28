import { useState, createContext, useContext } from "react";  // <-- Import useContext

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (user) => {
    setUser(user);
  };
  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);  // <-- useContext is now available
};
export default useAuth;
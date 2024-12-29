import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user-specific fields as needed
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user:User | null)=>void
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<User>("http://localhost:4000/auth/verifyToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to authenticate");
      } finally {
        setLoading(false);
      }
    };

    auth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

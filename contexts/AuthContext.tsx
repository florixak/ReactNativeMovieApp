import {
  LoginData,
  RegisterData,
  VerificationData,
} from "@/schemas/authSchemas";
import { loginUser, registerUser, verifyUser } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (loginData: LoginData) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verify: (verificationData: VerificationData) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const EXPIRES_IN_KEY = "auth_expires_in";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load stored authentication:", e);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = async (userData: User, token: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
      ]);
      setUser(userData);
      setToken(token);
    } catch (e) {
      console.error("Failed to store auth:", e);
      throw new Error("Failed to store authentication");
    }
  };

  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      setUser(null);
      setToken(null);
    } catch (e) {
      console.error("Failed to clear stored auth:", e);
    }
  };

  const login = async (loginData: LoginData): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await loginUser(loginData);

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (data && data.user && data.token) {
        await storeAuth(data.user, data.token);
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await registerUser({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });
      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearStoredAuth();
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async (verificationData: VerificationData): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await verifyUser(verificationData);

      if (!data.success) {
        console.error("Verification failed:", data.message);
        throw new Error(data.message || "Verification failed");
      }
    } catch (error: any) {
      throw new Error(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {};

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    verify,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AuthContextType = {
  userId: { [key: string]: any } | null;
  setUserId: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
  isLoggedIn: { [key: string]: any } | null;
  setIsLoggedIn: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AuthProvider = (props: { children: ReactNode }): ReactElement => {
  const [userId, setUserId] = useState<{ [key: string]: any } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<{ [key: string]: any } | null>(null);

  return <AuthContext.Provider {...props} value={{ userId, setUserId, isLoggedIn, setIsLoggedIn }} />;
};

export { AuthProvider, useAuth };

import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ matricula, password }) => {
    if (matricula === "123" && password === "1234") {
      setUser({ name: "Aluno Exemplo", matricula });
    } else {
      throw new Error("RA ou senha incorretos.");
    }
  };

  const logout = () => setUser(null);

  const updateEmail = async (email) => {
    setUser((prev) => ({ ...prev, email }));
    return { email };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
